import { parseStatusPage } from "./parse.js"
import { parseTime } from "./datetime.js"

const DATE_YESTERDAY = new Date(new Date() - 86400000).toISOString().slice(0, 10)
const BASE_URL = "https://reservia.viarail.ca/tsi/GetTrainStatus.aspx"

export async function fetchTrainData(db, trainNumber=53, arrivalDate=DATE_YESTERDAY) {
    const url = `${BASE_URL}?l=en&TsiCCode=VIA&TsiTrainNumber=${trainNumber}&ArrivalDate=${arrivalDate}`
    console.log(url, "\n")
    const statusPage = await fetch(url)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }
            return res.text()
         })

    const [origin, ...stations] = parseStatusPage(statusPage)
         .map(({ expectedArrival, actualArrival, ...station }) => ({
            expectedArrival: parseTime(expectedArrival),
            actualArrival: parseTime(actualArrival),
            ...station
        }))

    if (!origin || stations.length === 0) {
        console.warn("No arrivals\n")
        return
    }

    const stationStmt = db.prepare(`INSERT OR IGNORE INTO station (station_name) VALUES (?)`)
    const arrivalStmt = db.prepare(`
         INSERT INTO arrival (station_id, origin_id, train_number, date, scheduled_time, actual_time) VALUES (
             (SELECT station_id FROM station WHERE station_name = @stationName),
             @originId,
             @trainNumber,
             @arrivalDate,
             @expectedArrival,
             @actualArrival
         );
    `)

    // Add origin record
    db.prepare(`INSERT OR IGNORE INTO station (station_name) VALUES (?)`).run(origin.stationName)
    const originId = db.prepare("SELECT station_id FROM station WHERE station_name = ?").get(origin.stationName).station_id

    // Add arrival records
    for (const row of stations) {
        stationStmt.run(row.stationName)        
        try {
            arrivalStmt.run({ trainNumber, arrivalDate, originId, ...row })
            console.info(row.stationName)
        } catch (err) {
            const paddedStationName = row.stationName.padEnd(25, " ")
            if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
                console.info(`${paddedStationName} - ignoring duplicate row`)
                continue
            }
            if (err.code === "SQLITE_CONSTRAINT_NOTNULL") {
                console.info(`${paddedStationName} - missing fields`)
                continue
            }
            throw err
        }
            
    }
    console.log()
}

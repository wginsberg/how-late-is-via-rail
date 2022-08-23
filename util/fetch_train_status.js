import { parseStatusPage } from "./parse.js"

const DEFAULT_DATE = new Date().toISOString().slice(0, 10)
const BASE_URL = "https://reservia.viarail.ca/tsi/GetTrainStatus.aspx"

export async function fetchTrainData(db, trainNumber=53, arrivalDate=DEFAULT_DATE) {
    const url = `${BASE_URL}?l=en&TsiCCode=VIA&TsiTrainNumber=${trainNumber}&ArrivalDate=${arrivalDate}`
    console.log(url)
    const statusPage = await fetch(url)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }
            return res.text()
         })

    const [origin, ...stations] = parseStatusPage(statusPage)

    const stationStmt = db.prepare(`INSERT OR IGNORE INTO station (station_name) VALUES (?)`)
    const arrivalStmt = db.prepare(`
         INSERT INTO arrival (station_id, origin_id, train_number, scheduled_time, actual_time) VALUES (
             (SELECT station_id FROM station WHERE station_name = @stationName),
             @originId,
             @trainNumber,
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
        arrivalStmt.run({ trainNumber, originId, ...row })
    }
}

import { parseStatusPage } from "./parse.js"

const DEFAULT_DATE = new Date().toISOString().slice(0, 10)
const BASE_URL = "https://reservia.viarail.ca/tsi/GetTrainStatus.aspx"

export async function fetchTrainData(db, trainNumber=53, arrivalDate=DEFAULT_DATE) {
    const url = `${BASE_URL}?l=en&TsiCCode=VIA&TsiTrainNumber=${trainNumber}&ArrivalDate=${arrivalDate}`
    const statusPage = await fetch(url)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }
            return res.text()
         })

    const parsed = parseStatusPage(statusPage)

    db.run("begin transaction");
    const stmt = await db.prepare("INSERT INTO arrival (train_number, station_name, scheduled_time, actual_time) VALUES (?, ?, ?, ?)")
    for (const row of parsed) {
        stmt.run([trainNumber, ...Object.values(row)])
    }
    stmt.finalize()
    db.run("end transaction")
}

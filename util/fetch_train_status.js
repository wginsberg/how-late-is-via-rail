import { parseStatusPage } from "./parse.js"
import { parseTime } from "./datetime.js"

const BASE_URL = "https://reservia.viarail.ca/tsi/GetTrainStatus.aspx"

export async function fetchTrainData(trainNumber, arrivalDate) {
    const url = `${BASE_URL}?l=en&TsiCCode=VIA&TsiTrainNumber=${trainNumber}&ArrivalDate=${arrivalDate}`
    console.error(url, "\n")
    const statusPage = await fetch(url)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }
            return res.text()
         })

    const parsed = parseStatusPage(statusPage)
    const date = parsed.date
    const rows = parsed.rows.map(({ expectedArrival, actualArrival, ...station }) => ({
        expectedArrival: parseTime(expectedArrival),
        actualArrival: parseTime(actualArrival),
        ...station
    }))

    const [origin, ...stations] = rows

    if (!origin || stations.length === 0) {
        console.warn("No arrival data\n")
        return []
    }

    if (date !== arrivalDate) {
        console.warn(`Data returned for ${date} instead of ${arrivalDate}; ignoring\n`)
        return []
    }

    return rows
}

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

    const rows = parseStatusPage(statusPage)
         .map(({ expectedArrival, actualArrival, ...station }) => ({
            expectedArrival: parseTime(expectedArrival),
            actualArrival: parseTime(actualArrival),
            ...station
        }))

    const [origin, ...stations] = rows

    if (!origin || stations.length === 0) {
        console.warn("No arrivals\n")
        return []
    }

    return rows
}

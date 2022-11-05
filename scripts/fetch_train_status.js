import { fetchTrainData } from '../util/fetch_train_status.js'

const DEFAULT_TRAIN = "53"
const DEFAULT_DATE = new Date(new Date() - 86400000 - 86400000).toISOString().slice(0, 10)

const trains = process.argv[2]
    ? process.argv[2].split(",")
    : [DEFAULT_TRAIN]

const date = process.argv[3] || DEFAULT_DATE

for (const trainNumber of trains) {
    const results = await fetchTrainData(trainNumber, date)
    const [origin, ...arrivals] = results
    for (const arrival of arrivals) {
        const { stationName, expectedArrival, actualArrival, minutesLate } = arrival
        const columns = [trainNumber, stationName, origin.stationName, date, expectedArrival, actualArrival, minutesLate]
        console.log(columns.join(","))
    }
}

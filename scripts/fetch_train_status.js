import getTrainStatusPage from '../util/fetch_train_status.js'

const DEFAULT_DATE = new Date().toISOString().slice(0, 10)

const trainNumber = process.argv[2]
const arrivalDate = process.argv[3] || DEFAULT_DATE

if (!trainNumber) {
    console.error("Usage: npm run fetch-train-status <train number> [date]\n")
}

const page = await getTrainStatusPage(trainNumber, arrivalDate)
console.log(page)
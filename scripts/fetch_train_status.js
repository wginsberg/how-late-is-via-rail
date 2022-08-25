import Database from 'better-sqlite3'
import { fetchTrainData } from '../util/fetch_train_status.js'

const DEFAULT_TRAIN = "53"
const DEFAULT_DB = "mora.db"

const trains = process.argv[2]
    ? process.argv[2].split(",")
    : [DEFAULT_TRAIN]

const date = process.argv[3]

const dbName = process.argv[4] || DEFAULT_DB
console.log(`Connecting to ${dbName}\n`)
const db = new Database(dbName)

for (const trainNumber of trains) {
    await fetchTrainData(db, trainNumber, date)
}

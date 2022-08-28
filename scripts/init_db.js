import { writeFile } from 'fs/promises'

const DEFAULT_PATH = 'data.csv'

const path = process.argv[2] || DEFAULT_PATH

const columns = ["train_number", "station", "origin", "date", "scheduled_time", "actual_time"]
const header = columns.join(",")
await writeFile(path, header + '\n')
console.log(path)

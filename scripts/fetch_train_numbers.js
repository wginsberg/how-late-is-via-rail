import { promisify } from 'util'
import { pipeline } from 'stream'
import { createWriteStream, writeFileSync } from 'fs'
import AdmZip from 'adm-zip'

const URL = "https://www.viarail.ca/sites/all/files/gtfs/viarail.zip"
const ZIP_PATH = "viarail.zip"
const TARGET = "trains.txt"

/* Download schedule files */
const streamPipeline = promisify(pipeline)
const response = await fetch(URL)
if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
await streamPipeline(response.body, createWriteStream(ZIP_PATH))

/* Unzip */

const zip = new AdmZip(ZIP_PATH)
const zipEntry= zip.getEntries().find(({ entryName }) => entryName === "trips.txt")

/* Filter trips */

const allTrips = zipEntry.getData().toString("utf8").split("\r\n")
const re = /([0-9]+),(Toronto|Montréal|Québec|Ottawa|Windsor|Kingston|London|Sarnia|Niagara Falls),/
const trips = allTrips
    .map(trip => trip.match(re)?.[1])
    .filter(x => !!x)

/* Write results */

writeFileSync(TARGET, trips.join(","))
console.log(TARGET)

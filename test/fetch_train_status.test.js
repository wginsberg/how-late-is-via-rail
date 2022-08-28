import { promisify } from 'util';
import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import assert from 'assert';

const csvPath = "test.csv"

/* Create a fresh database */

const execPromise = promisify(exec)

await execPromise(`npm run init-db ${csvPath}`)

/* Fetch data for single train */

await execPromise(`npm run fetch-train-status --silent >> ${csvPath}`)

/* Check that database contains the new data */

const arrivals = await readFile(csvPath)
    .then(buffer => buffer.toString())
    .then(text => text.split("\n").slice(1))

console.log(arrivals)
assert(arrivals.length > 1, `${csvPath} should have more than 1 row`)

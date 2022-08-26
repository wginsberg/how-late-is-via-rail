import { promisify } from 'util';
import { exec } from 'child_process';
import { rm } from 'fs/promises';
import Database from 'better-sqlite3'
import assert from 'assert';
import { fetchTrainData } from '../util/fetch_train_status.js';

const DB_NAME = "test.db"

/* Create a fresh database */

await rm(DB_NAME)
    .catch(e => {
        if (e?.code !== 'ENOENT') throw e
    })

const execPromise = promisify(exec)

await execPromise(`npm run init-db ${DB_NAME}`)

/* Fetch data for single train */

const db = new Database(DB_NAME)

await fetchTrainData(db)

/* Check that database contains the new data */

const rows = db.prepare("SELECT * FROM arrival").all()
db.close()

// const [{ count }] = results
console.log(rows)
assert(rows.length > 1, 'There should be more than 1 row in the "arrivals" table')

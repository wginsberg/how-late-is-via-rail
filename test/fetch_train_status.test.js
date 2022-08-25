import { promisify } from 'util';
import { exec } from 'child_process';
import { rm } from 'fs/promises';
import Database from 'better-sqlite3'

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

db.close()

/* Check that database contains the new data */

console.warn("Unfinished test implementation")

/* Check that generated HTML contains the new data */

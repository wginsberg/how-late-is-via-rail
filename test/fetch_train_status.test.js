import { promisify } from 'util';
import { exec } from 'child_process';
import { rm } from 'fs/promises';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

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

const db = await open({ filename: DB_NAME, driver: sqlite3.Database })

await fetchTrainData(db)

await db.close()

/* Check that database contains the new data */

console.warn("Unfinished test implementation")

/* Check that generated HTML contains the new data */

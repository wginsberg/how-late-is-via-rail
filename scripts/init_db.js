import Database from 'better-sqlite3'

const DEFAULT_DB = 'mora.db'

const dbName = process.argv[2] || DEFAULT_DB
const db = new Database(dbName)

// Create tables

db.exec(`
    CREATE TABLE station (
        station_id INTEGER PRIMARY KEY,
        station_name TEXT NOT NULL UNIQUE
    )
`)

db.exec(`
    CREATE TABLE arrival (
        arrival_id INTEGER PRIMARY KEY,
        train_number INTEGER NOT NULL,
        station_id INTEGER NOT NULL,
        origin_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        actual_time TEXT NOT NULL,
        FOREIGN KEY (station_id) REFERENCES station (station_id),
        FOREIGN KEY (origin_id) REFERENCES station (station_id),
        UNIQUE (train_number, station_id, date)
    )
`)

console.log(dbName)

import Database from 'better-sqlite3'

const DB_NAME = process.argv[2] || 'mora.db'

const db = new Database(DB_NAME)

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
        train_number INTEGER,
        station_id INTEGER,
        origin_id INTEGER,
        scheduled_time TEXT,
        actual_time TEXT,
        FOREIGN KEY (station_id) REFERENCES station (station_id),
        FOREIGN KEY (origin_id) REFERENCES station (station_id)
    )
`)

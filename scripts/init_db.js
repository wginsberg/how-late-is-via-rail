import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const DB_NAME = 'mora.db'

const db = await open({ filename: DB_NAME, driver: sqlite3.Database })

// Create tables

await db.exec(`
    CREATE TABLE route (route_id INTEGER PRIMARY KEY, name TEXT NOT NULL)
`)

await db.exec(`
    CREATE TABLE station (station_id INTEGER PRIMARY KEY, name TEXT NOT NULL)
`)

await db.exec(`
    CREATE TABLE route_station (
        route_id INTEGER,
        station_id INTEGER,
        PRIMARY KEY (route_id, station_id),
        FOREIGN KEY (route_id) REFERENCES route (route_id),
        FOREIGN KEY (station_id) REFERENCES station (station_id)
    )
`)

await db.exec(`
    CREATE TABLE arrival (
        arrival_id INTEGER PRIMARY KEY,
        route_station_id INTEGER,
        scheduled_time TEXT,
        actual_time TEXT,
        FOREIGN KEY (route_station_id) REFERENCES route_station (route_station_id)
    )
`)

// Seed route data

await db.exec(`
    INSERT INTO route (route_id, name)
    VALUES (53, 'Toronto – Kingston – Ottawa (Westbound)')
`)

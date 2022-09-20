import { parse } from "node-html-parser"

export function parseStatusPage(text = '') {
    const parsed = parse(text)
    const rows = parsed.querySelectorAll("#tsicontent > *")
    const re = /(.+?)(\d\d\d\d-\d\d-\d\d)?(Arr:)?(Dep:)?(\d\d:\d\d)(\d\d:\d\d)(\d\d:\d\d)?(\d\d:\d\d)?/

    let departureDate
    const results = rows
        .map(row => {
            const result = re.exec(row.removeWhitespace().innerText)?.slice(1) || []
            const [stationName, date, didArrive, didDepart, ...times] = result

            // Keep track of first date seen as the departure date
            if (!departureDate) departureDate = date

            // Origin station has no arrival
            if (!didArrive) return { stationName }

            // Order of values in the table changes for final station
            const [expectedArrival, actualArrival] = didDepart
                ? [times[0], times[2]]
                : [times[0], times[1]]
            return { stationName, expectedArrival, actualArrival }
        })
        .filter(({ stationName }) => stationName)
        .filter(({ actualArrival }, i) => {
            if(i === 0) return true             // always include origin station
            if(!!actualArrival) return true     // filter out missing data
        })

    // Normalize times for arrivals after midnight
    for (let i = 0; i < results.length; i++) {
        const [expectedHour] = results[i].expectedArrival?.split(":").map(Number) || []
        const [actualHour, actualMinute] = results[i].actualArrival?.split(":").map(Number) || []

        // If the train arrives more than 12 hours early, assume it is the next day
        if (expectedHour - actualHour > 12) {
            const newHour = actualHour + 24
            const newTime = [newHour, actualMinute]
                .map(String)
                .map(s => s.padStart(2, "0"))
                .join(":")
            results[i].actualArrival = newTime
        }
    }

    const result = {
        date: departureDate,
        rows: results
    }

    return result
}

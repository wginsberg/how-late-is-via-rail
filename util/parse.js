import { parse } from "node-html-parser"

export function parseStatusPage(text = '') {
    const parsed = parse(text)
    const rows = parsed.querySelectorAll("#tsicontent > *")
    const re = /(.+?)(\d\d\d\d-\d\d-\d\d)?(Arr:)?(Dep:)?(\d\d:\d\d)(\d\d:\d\d)(\d\d:\d\d)?(\d\d:\d\d)?/
    const results = rows
        .map(row => {
            const result = re.exec(row.removeWhitespace().innerText)?.slice(1) || []
            const [stationName, _date, didArrive, didDepart, ...times] = result

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

    return results
}

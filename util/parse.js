import { parse } from "node-html-parser"

export function parseStatusPage(text) {
    const parsed = parse(text)
    const rows = parsed.querySelector("table>tbody").removeWhitespace().childNodes

    const re = /(.+?)(\d\d\d\d-\d\d-\d\d)?(Arr:)(Dep:)?(\d\d:\d\d)(\d\d:\d\d)(\d\d:\d\d)?(\d\d:\d\d)?/
    const results = rows
        .map(row => {
            const result = re.exec(row.innerText)?.slice(1) || []
            const [stationName, _date, didArrive, didDepart, ...times] = result

            // Order of values in the table changes for final station
            const [expectedArrival, actualArrival] = didDepart
                ? [times[0], times[2]]
                : [times[0], times[1]]

            return { stationName, expectedArrival, actualArrival }
        })
        .filter(({ stationName, expectedArrival, actualArrival }) => {
            const fields = [stationName, expectedArrival, actualArrival]
            return fields.every(x => !!x)
        })

    return results
}

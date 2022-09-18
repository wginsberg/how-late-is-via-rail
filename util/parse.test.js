import { deepStrictEqual } from 'assert/strict'
import { readFileSync } from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
import { parseStatusPage } from "./parse.js";

{
    /* Handles empty input */

    const actual = parseStatusPage()
    const expected = []
    deepStrictEqual(actual, expected)
}

{
    /* Handles actual HTML page */

    // https://reservia.viarail.ca/tsi/GetTrainStatus.aspx?l=en&TsiCCode=VIA&TsiTrainNumber=53&ArrivalDate=2022-08-22
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const html = readFileSync(path.resolve(dirname, './parse.test.html'))

    const actual = parseStatusPage(html)
    const expected = ([
        { stationName: 'OTTAWA' },
        { stationName: 'FALLOWFIELD RAIL STATION', expectedArrival: '12:02', actualArrival: '12:03' },
        { stationName: 'SMITHS FALLS', expectedArrival: '12:34', actualArrival: '12:39' },
        { stationName: 'BROCKVILLE', expectedArrival: '13:09', actualArrival: '13:24' },
        { stationName: 'GANANOQUE', expectedArrival: '13:36', actualArrival: '13:53' },
        { stationName: 'KINGSTON', expectedArrival: '13:57', actualArrival: '14:17' },
        { stationName: 'BELLEVILLE', expectedArrival: '14:40', actualArrival: '14:56' },
        { stationName: 'COBOURG', expectedArrival: '15:20', actualArrival: '15:32' },
        { stationName: 'OSHAWA', expectedArrival: '15:53', actualArrival: '16:04' },
        { stationName: 'TORONTO UNION STATION', expectedArrival: '16:33', actualArrival: '16:48' }
    ])

    deepStrictEqual(actual, expected)
}

{
    /* Handles arrival times after midnight */

    // https://reservia.viarail.ca/tsi/GetTrainStatus.aspx?l=en&TsiCCode=VIA&TsiTrainNumber=79&ArrivalDate=2022-09-10
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const html = readFileSync(path.resolve(dirname, './parse_after_midnight.test.html'))

    const actual = parseStatusPage(html)
    const expected = ([
        { stationName: 'TORONTO UNION STATION' },
        { stationName: 'OAKVILLE', expectedArrival: '20:07', actualArrival: '20:16' },
        { stationName: 'ALDERSHOT', expectedArrival: '20:22', actualArrival: '20:37' },
        { stationName: 'BRANTFORD', expectedArrival: '20:50', actualArrival: '22:04' },
        { stationName: 'WOODSTOCK', expectedArrival: '21:17', actualArrival: '22:32' },
        { stationName: 'INGERSOLL', expectedArrival: '21:30', actualArrival: '22:45' },
        { stationName: 'LONDON', expectedArrival: '21:52', actualArrival: '23:08' },
        { stationName: 'GLENCOE', expectedArrival: '22:25', actualArrival: '23:49' },
        { stationName: 'CHATHAM', expectedArrival: '22:57', actualArrival: '24:34' },
        { stationName: 'WINDSOR', expectedArrival: '23:44', actualArrival: '25:15' }
    ])

    deepStrictEqual(actual, expected)
}

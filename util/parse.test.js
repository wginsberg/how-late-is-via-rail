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

{
    /* Handles entries that appear out of order */

    // https://reservia.viarail.ca/tsi/GetTrainStatus.aspx?l=en&TsiCCode=VIA&TsiTrainNumber=15&ArrivalDate=2022-09-10
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const html = readFileSync(path.resolve(dirname, './parse_out_of_order.test.html'))

    const actual = parseStatusPage(html)
    const expected = ([
        { stationName: 'HALIFAX' },
        { stationName: 'TRURO', expectedArrival: '14:26', actualArrival: '15:23' },
        { stationName: 'SPRINGHILL JCT', expectedArrival: '15:42', actualArrival: '16:37' },
        { stationName: 'AMHERST', expectedArrival: '16:05', actualArrival: '16:58' },
        { stationName: 'SACKVILLE', expectedArrival: '16:22', actualArrival: '17:15' },
        { stationName: 'MONCTON', expectedArrival: '17:17', actualArrival: '18:00' },
        { stationName: 'ROGERSVILLE', expectedArrival: '18:41', actualArrival: '19:46' },
        { stationName: 'MIRAMICHI', expectedArrival: '19:32', actualArrival: '20:33' },
        { stationName: 'BATHURST', expectedArrival: '21:18', actualArrival: '22:06' },
        { stationName: 'PETIT ROCHER', expectedArrival: '21:47', actualArrival: '22:28' },
        { stationName: 'JACQUET RIVER', expectedArrival: '22:10', actualArrival: '22:51' },
        { stationName: 'CHARLO', expectedArrival: '22:34', actualArrival: '23:29' },
        { stationName: 'CAMPBELLTON', expectedArrival: '23:08', actualArrival: '24:16' },
        { stationName: 'MATAPEDIA', expectedArrival: '22:50', actualArrival: '23:58' },
        { stationName: 'CAUSAPSCAL', expectedArrival: '23:39', actualArrival: '24:48' },
        { stationName: 'AMQUI', expectedArrival: '23:59', actualArrival: '25:08' },
        { stationName: 'SAYABEC', expectedArrival: '00:21', actualArrival: '01:49' },
        { stationName: 'MONT-JOLI', expectedArrival: '01:21', actualArrival: '02:56' },
        { stationName: 'RIMOUSKI', expectedArrival: '01:54', actualArrival: '03:31' },
        { stationName: 'TROIS PISTOLES', expectedArrival: '03:01', actualArrival: '05:01' },
        { stationName: 'RIVIÈRE-DU-LOUP', expectedArrival: '03:38', actualArrival: '06:02' },
        { stationName: 'LA POCATIERE', expectedArrival: '04:35', actualArrival: '06:46' },
        { stationName: 'MONTMAGNY', expectedArrival: '05:10', actualArrival: '07:46' },
        { stationName: 'SAINTE-FOY', expectedArrival: '06:13', actualArrival: '09:03' },
        { stationName: 'DRUMMONDVILLE', expectedArrival: '08:30', actualArrival: '11:22' },
        { stationName: 'SAINT-HYACINTHE', expectedArrival: '09:10', actualArrival: '11:50' },
        { stationName: 'SAINT-LAMBERT', expectedArrival: '09:44', actualArrival: '12:18' },
        { stationName: 'MONTRÉAL', expectedArrival: '10:03', actualArrival: '12:34' }
    ])

    deepStrictEqual(actual, expected)
}
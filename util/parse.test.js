import { deepStrictEqual } from 'assert/strict'
import { readFileSync } from 'fs';
import path from 'path'
import { fileURLToPath } from 'url'
import { parseStatusPage } from "./parse.js";

const dirname = path.dirname(fileURLToPath(import.meta.url))

{
    const html = readFileSync(path.resolve(dirname, './parse.test.html'))

    const actual = parseStatusPage(html)
    const expected = ([
        { stationName: 'FALLOWFIELD RAIL STATION', expectedArrival: '12:02', actualArrival: '12:01' },
        { stationName: 'SMITHS FALLS', expectedArrival: '12:34', actualArrival: '12:33' },
        { stationName: 'BROCKVILLE', expectedArrival: '13:09', actualArrival: '13:09' },
        { stationName: 'GANANOQUE', expectedArrival: '13:36', actualArrival: '13:49' },
        { stationName: 'KINGSTON', expectedArrival: '13:57', actualArrival: '14:11' },
        { stationName: 'BELLEVILLE', expectedArrival: '14:40', actualArrival: '15:23' },
        { stationName: 'COBOURG', expectedArrival: '15:20', actualArrival: '16:01' },
        { stationName: 'OSHAWA', expectedArrival: '15:53', actualArrival: '16:57' },
        { stationName: 'TORONTO UNION STATION', expectedArrival: '16:33', actualArrival: '17:46' }
    ])

    deepStrictEqual(actual, expected)
}

{
    const html = `
        <table>
            <tbody>
                <tr>
                    <td>TEST STATION NAME</td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>Arr:</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Dep:</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td>18:12</td>
                                </tr>
                                <tr>
                                    <td>18:14</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td>18:13</td>
                                </tr>
                                <tr>
                                    <td>18:15</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    `

    const actual = parseStatusPage(html)
    const expected = ([{ stationName: 'TEST STATION NAME', expectedArrival: '18:12', actualArrival: '18:13' }])

    deepStrictEqual(actual, expected)
}

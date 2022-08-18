import { deepStrictEqual } from 'assert/strict'

import { parseStatusPage } from "./parse.js";

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
    const expected = ([{ station_name: 'TEST STATION NAME', expectedArrival: '18:12', actualArrival: '18:13' }])

    deepStrictEqual(actual, expected)
}

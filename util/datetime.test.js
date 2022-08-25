import { parseTime } from "./datetime.js";
import { deepStrictEqual } from 'assert/strict'

{
    const actual = parseTime("00:00")
    const expected = 0
    deepStrictEqual(actual, expected)
}

{
    const actual = parseTime("01:01")
    const expected = 61
    deepStrictEqual(actual, expected)
}

{
    const actual = parseTime("17:53")
    const expected = 1073
    deepStrictEqual(actual, expected)
}
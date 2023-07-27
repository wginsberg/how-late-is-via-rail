import { getLookup, getStats } from "./util";

describe("getLookup", () => {
    it("handles empty input gracefully", () => {
        const actual = getLookup()
        expect(actual).toEqual({})
    })

    it("adds the lookup structure", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "FALLOWFIELD", "OTTAWA", "2023-06-24", "14:54", "15:01", 7],
            [52, "KINGSTON", "TORONTO UNION STATION", "2023-06-23", "10:57", "11:10", 13],
            [52, "KINGSTON", "TORONTO UNION STATION", "2023-07-23", "10:57", "11:12", 15]
        ]

        const actual = getLookup(records)

        const expected = {
            "OSHAWA": {
                "TORONTO UNION STATION": {
                    44: [
                        [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7]
                    ]
                }
            },
            "KINGSTON": {
                "TORONTO UNION STATION": {
                    44: [
                        [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13]
                    ],
                    52: [
                        [52, "KINGSTON", "TORONTO UNION STATION", "2023-06-23", "10:57", "11:10", 13],
                        [52, "KINGSTON", "TORONTO UNION STATION", "2023-07-23", "10:57", "11:12", 15]
                    ]
                }
            },
            "FALLOWFIELD": {
                "OTTAWA": {
                    645: [
                        [645, "FALLOWFIELD", "OTTAWA", "2023-06-24", "14:54", "15:01", 7]
                    ]
                }
            }
        }

        expect(actual).toEqual(expected)
    })
})

describe("getStats", () => {
    it("handles empty stats gracefully", () => {
        const actual = getStats()
        expect(actual.availableStations).toEqual([])
        expect(actual.availableOrigins).toEqual([])
        expect(actual.availableTrainNumbers).toEqual([])
        expect(actual.filteredRecords).toEqual([])
    })

    it("returns all records when no filters applied", () => {
        const lookup = {
            "OSHAWA": {
                "TORONTO UNION STATION": {
                    44: [
                        [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7]
                    ]
                }
            },
            "KINGSTON": {
                "TORONTO UNION STATION": {
                    44: [
                        [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13]
                    ]
                }
            },
            "BROCKVILLE": {
                "TORONTO UNION STATION": {
                    44: [
                        [44, "BROCKVILLE", "TORONTO UNION STATION", "2023-07-21", "17:20", "17:33", 13]
                    ]
                }
            }
        }

        const actual = getStats(lookup)
        const expected = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [44, "BROCKVILLE", "TORONTO UNION STATION", "2023-07-21", "17:20", "17:33", 13]
        ]

        expect(actual.filteredRecords).toEqual(expected)
    })

    it("filters records when arrival station supplied", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "KINGSTON", "OTTAWA", "2022-08-26", "16:34", "16:52", 18]
        ]

        const actual = getStats(getLookup(records), "KINGSTON")

        const expectedRecords = [
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "KINGSTON", "OTTAWA", "2022-08-26", "16:34", "16:52", 18]
        ]

        expect(actual.filteredRecords).toEqual(expectedRecords)
    })

    it("filters records when origin supplied", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "KINGSTON", "OTTAWA", "2022-08-26", "16:34", "16:52", 18]
        ]

        const actual = getStats(getLookup(records), "KINGSTON", "OTTAWA")

        const expectedRecords = [
            [645, "KINGSTON", "OTTAWA", "2022-08-26", "16:34", "16:52", 18]
        ]

        expect(actual.filteredRecords).toEqual(expectedRecords)
    })

    it("filters records when train number supplied", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [66, "KINGSTON", "TORONTO UNION STATION", "2022-08-26", "17:37", "17:51", 14],
            [645, "KINGSTON", "OTTAWA", "2022-08-26", "16:34", "16:52", 18]
        ]

        const actual = getStats(getLookup(records), "KINGSTON", "TORONTO UNION STATION", 44)

        const expectedRecords = [
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
        ]

        expect(actual.filteredRecords).toEqual(expectedRecords)
    })

    it("returns all options", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "KINGSTON", "OTTAWA", "2022-08-26", "16:34", "16:52", 18],
            [645, "FALLOWFIELD", "OTTAWA", "2023-06-24", "14:54", "15:01", 7],
            [52, "KINGSTON", "TORONTO UNION STATION", "2023-06-23", "10:57", "11:10", 13]
        ]

        const actual = getStats(getLookup(records))

        const expectedStations = ["FALLOWFIELD", "KINGSTON", "OSHAWA"]
        const expectedOrigins = ["OTTAWA", "TORONTO UNION STATION"]
        const expectedTrainNumbers = ["44", "52", "645"]

        expect(actual.availableStations).toEqual(expectedStations)
        expect(actual.availableOrigins).toEqual(expectedOrigins)
        expect(actual.availableTrainNumbers).toEqual(expectedTrainNumbers)
    })

    it("filters other origins when station supplied", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "FALLOWFIELD", "OTTAWA", "2023-06-24", "14:54", "15:01", 7],
            [52, "KINGSTON", "TORONTO UNION STATION", "2023-06-23", "10:57", "11:10", 13]
        ]

        const actual = getStats(getLookup(records), "KINGSTON")

        const expectedStations = ["FALLOWFIELD", "KINGSTON", "OSHAWA"]
        const expectedOrigins = ["TORONTO UNION STATION"]
        const expectedTrainNumbers = ["44", "52"]

        expect(actual.availableStations).toEqual(expectedStations)
        expect(actual.availableOrigins).toEqual(expectedOrigins)
        expect(actual.availableTrainNumbers).toEqual(expectedTrainNumbers)
    })

    it("filters train options when station and origin supplied", () => {
        const records = [
            [44, "OSHAWA", "TORONTO UNION STATION", "2023-07-21", "14:53", "15:00", 7],
            [44, "KINGSTON", "TORONTO UNION STATION", "2023-07-21", "16:34", "16:47", 13],
            [645, "FALLOWFIELD", "OTTAWA", "2023-06-24", "14:54", "15:01", 7],
            [52, "KINGSTON", "TORONTO UNION STATION", "2023-06-23", "10:57", "11:10", 13]
        ]

        const actual = getStats(getLookup(records), "KINGSTON", "TORONTO UNION STATION")

        const expectedStations = ["FALLOWFIELD", "KINGSTON", "OSHAWA"]
        const expectedOrigins = ["TORONTO UNION STATION"]
        const expectedTrainNumbers = ["44", "52"]

        expect(actual.availableStations).toEqual(expectedStations)
        expect(actual.availableOrigins).toEqual(expectedOrigins)
        expect(actual.availableTrainNumbers).toEqual(expectedTrainNumbers)
    })
})

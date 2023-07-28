import { mean, standardDeviation} from "simple-statistics"

export function getLookup(records = []) {
    const lookup = {}

    for (const record of records) {
        const [trainNumber, station, origin] = record

        if (!lookup[station]) {
            lookup[station] = {}
        }
        if (!lookup[station][origin]) {
            lookup[station][origin] = {}
        }
        if (!lookup[station][origin][trainNumber]) {
            lookup[station][origin][trainNumber] = []
        }

        lookup[station][origin][trainNumber].push(record)
    }

    return lookup
}

export function getStats(lookup = {}, selectedStation, selectedOrigin, selectedTrainNumber) {

    const availableStations = Object.keys(lookup)
    const availableOrigins = new Set()
    const availableTrainNumbers = new Set()
    const filteredRecords = []

    // Add origin options
    for (const station in lookup) {
        if (selectedStation && station !== selectedStation) continue
        for (const origin in lookup[station]) {
            availableOrigins.add(origin)
        }
    }

    // Add train numbers and records
    for (const station in lookup) {
        if (selectedStation && station !== selectedStation) continue
        for (const origin in lookup[station]) {
            if (selectedOrigin && origin !== selectedOrigin) continue
            for (const trainNumber in lookup[station][origin]) {
                availableTrainNumbers.add(trainNumber)
                if (selectedTrainNumber && trainNumber !== `${selectedTrainNumber}`) continue
                for (const record of lookup[station][origin][trainNumber]) {
                    filteredRecords.push(record)
                }
            }
        }
    }

    const delays = filteredRecords.map(record => Number(record[6]))

    const delayMean = delays.length > 1 ? mean(delays) : delays[0]
    const delayStdDev = delays.length > 1 ? standardDeviation(delays) : undefined

    return {
        availableStations: availableStations.sort(),
        availableOrigins: [...availableOrigins].sort(),
        availableTrainNumbers: [...availableTrainNumbers].sort(),
        filteredRecords,
        delayMean,
        delayStdDev
    }
}
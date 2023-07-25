export function getStats(records = [], selectedStation, selectedOrigin, selectedTrainNumber) {
    const filteredRecords = []
    const stations = new Set()
    const origins = new Set()
    const trainNumbers = new Set()

    for (const record of records) {
        const [trainNumber, station, origin] = record

        if (selectedStation && station !== selectedStation){
            stations.add(station)
            continue
        }
        if (selectedOrigin && origin !== selectedOrigin) {
            origins.add(origin)
            continue
        }
        if (selectedTrainNumber && trainNumber !== selectedTrainNumber) {
            trainNumbers.add(trainNumber)
            continue
        }

        stations.add(station)
        origins.add(origin)
        trainNumbers.add(trainNumber)

        filteredRecords.push(record)
    }

    const availableStations = [...stations].sort()
    const availableOrigins = [...origins].sort()
    const availableTrainNumbers = [...trainNumbers].sort()

    return {
        filteredRecords,
        availableStations,
        availableOrigins,
        availableTrainNumbers
    }
}
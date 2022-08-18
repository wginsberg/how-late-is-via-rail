export default async function getTrainStatusPage(trainNumber, arrivalDate) {
    const url = `https://reservia.viarail.ca/tsi/GetTrainStatus.aspx?l=en&TsiCCode=VIA&TsiTrainNumber=${trainNumber}&ArrivalDate=${arrivalDate}`
    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`)
            }
            return res.text()
         })
}

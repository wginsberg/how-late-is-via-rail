export function parseTime(time="00:00") {
    const [hours, minutes] = time.split(":").map(Number)
    const result = hours * 60 + minutes
    return result
}
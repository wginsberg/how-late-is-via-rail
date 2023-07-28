import { Typography } from "@mui/material"
import React from "react"

export default function(props) {
    const { delayMean, delayStdDev } = props

    const mean = Math.floor(delayMean)
    const lowerBound = Math.floor(delayMean - delayStdDev)
    const upperBound = Math.ceil(delayMean + delayStdDev)

    if (!delayMean || !delayStdDev) return ""

    let message

    if (upperBound <= 5) {
        message = "Typically runs on time"
    } else if (lowerBound <= 5) {
        message = `Often runs up to ${upperBound} minutes late`
    } else if (upperBound - lowerBound < 15) {
        message = `Typically arrives around ${mean} minutes late`
    } else if (lowerBound < 0) {
        message = `Typically arrives 0 to ${upperBound} minutes late`
    } else {
        message = `Typically arrives ${lowerBound} to ${upperBound} minutes late`
    }

    return (<Typography sx={{ pt: 2 }}>{message}</Typography>)
}

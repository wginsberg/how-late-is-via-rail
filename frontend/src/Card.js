import React from "react"
import { formatDistanceToNow } from 'date-fns';
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Train from "./Train";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from "@mui/material/Box"

export default function (props) {
    const { trainNumber, station, origin, minutesLate, date } = props

    const delayMessage = minutesLate < 0
        ? `${-minutesLate} minutes early`
        : minutesLate === 0
            ? `On time`
            : `${minutesLate} minutes late`

    const color = minutesLate < 10
        ? "green"
        : minutesLate < 25
            ? "yellow"
            : "red"

    return (
        <Paper sx={{ borderLeft: `4px solid ${color}`, width: "100%", padding: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Typography component="span" noWrap>{origin}</Typography>
                <Box sx={{ display: "flex", gap: 1}}>
                    <ArrowForwardIcon />
                    <Typography component="span" noWrap><strong>{station}</strong></Typography>
                </Box>
            </Box>
            <Train trainNumber={trainNumber} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>{delayMessage}</Typography>
                <Typography>{date && formatDistanceToNow(new Date(date))} ago</Typography>
            </Box>
        </Paper>
    )
}

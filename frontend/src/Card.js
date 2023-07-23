import React from "react"
import { formatDistanceToNow } from 'date-fns';
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"

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
        <Card sx={{ borderLeft: `4px solid ${color}`, width: "100%" }}>
            <CardContent>
                <Typography component="span" noWrap>{origin}</Typography>
                <span> - </span>
                <Typography component="span" noWrap><strong>{station}</strong></Typography>
                <Typography>{delayMessage}</Typography>
                <Typography>Train {trainNumber}</Typography>
                <Typography>{formatDistanceToNow(new Date(date))} ago</Typography>
                <Typography>{date}</Typography>
            </CardContent>
        </Card>
    )
}

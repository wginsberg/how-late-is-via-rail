import React from "react"
import TrainIcon from '@mui/icons-material/Train';
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function (props) {
    const { trainNumber } = props

    return (
        <Box sx={{ border: 1, borderRadius: 1, display: "inline-flex", alignItems: "center", p: 1, my: 2 }}>
            <TrainIcon sx={{ mr: 1 }}/>
            <Typography>{trainNumber}</Typography>
        </Box>
    )
}
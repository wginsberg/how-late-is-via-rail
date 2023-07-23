import { createFilterOptions } from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import Card from "./Card"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from "@mui/material/Autocomplete"
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'

const TORONTO = "TORONTO UNION STATION"

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [records, setRecords] = useState([])
  const [arrivalStationInputValue, setArrivalStationInputValue] = useState("")
  const [originStationInputValue, setOriginStationInputValue] = useState("")
  const [trainNumberInputValue, setTrainNumberInputValue] = useState("")

  useEffect(() => {
    async function fetchData () {
      const text = await fetch("data.csv")
        .then(file => file.text())
      const rows = text
        .split("\n")
        .map(row => row.split(","))
        .slice(1, -1)

      setRecords(rows)
    }
    fetchData()
  }, [])

  const destinations = records.reduce((acc, next) => {
    const origin = next[2]
    const station = next[1]
    const destinationSet = acc[origin] || new Set()
    destinationSet.add(station)

    return {
      ...acc,
      [origin]: destinationSet
    }
  }, {})

  const stationSet = new Set()
  for (const destinationList of Object.values(destinations)) {
    for (const station of destinationList) {
      stationSet.add(station)
    }
  }
  
  const allStations = [...stationSet].sort((a, b) => {
    if (a === TORONTO) return -1
    if (a < b) return -1
    return 1
  })

  const trainNumbers = [...records.reduce((acc, next) => {
    const trainNumber = next[0]
    acc.add(trainNumber)
    return acc
  }, new Set())].sort()

  const results = records
    .filter(record => {
      const trainNumber = record[0]
      const station = record[1]
      const origin = record[2]

      if (arrivalStationInputValue && station !== arrivalStationInputValue) return false
      if (originStationInputValue && origin !== originStationInputValue) return false
      if (trainNumberInputValue && trainNumber !== trainNumberInputValue) return false

      return true
    })
    .toReversed()
    .slice(0, 100)
    

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
          <Grid container component="form" spacing={2} paddingTop={2}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={allStations}
                inputValue={arrivalStationInputValue}
                onInputChange={(e, value) => setArrivalStationInputValue(value)}
                renderInput={(params) => <TextField {...params} label="Arrival Station" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={Object.keys(destinations)}
                inputValue={originStationInputValue}
                onInputChange={(e, value) => setOriginStationInputValue(value)}
                renderInput={(params) => <TextField {...params} label="Origin Station" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                inputValue={trainNumberInputValue}
                onInputChange={(e, value) => setTrainNumberInputValue(value)}
                filterOptions={createFilterOptions({ matchFrom: "start" })}
                options={trainNumbers}
                renderInput={(params) => <TextField {...params} label="Train Number" />}
              />
            </Grid>
          </Grid>
          <List>
            {results.map((row) => (
              <ListItem key={row}>
                <Card
                  trainNumber={row[0]}
                  station={row[1]}
                  origin={row[2]}
                  minutesLate={Number(row[6])}
                  date={row[3]}
                />
              </ListItem>
            ))}
          </List>
      </Container>
    </ThemeProvider>
  );
}

export default App;

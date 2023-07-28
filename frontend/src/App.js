import { createFilterOptions } from '@mui/material/Autocomplete';
import React, { useEffect, useState, useMemo } from 'react';
import Card from "./Card"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from "@mui/material/Autocomplete"
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'
import { getLookup, getStats } from "./util"
import { TORONTO } from './constants';
import { Skeleton } from '@mui/material';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [records, setRecords] = useState([])
  const [arrivalStationInputValue, setArrivalStationInputValue] = useState("")
  const [arrivalStation, setArrivalStation] = useState("")
  const [originStationInputValue, setOriginStationInputValue] = useState("")
  const [originStation, setOriginStation] = useState("")
  const [trainNumberInputValue, setTrainNumberInputValue] = useState("")
  const [trainNumber, setTrainNumber] = useState("")

  useEffect(() => {
    async function fetchData () {
      const text = await fetch("data.csv")
        .then(file => file.text())
      const rows = text
        .split("\n")
        .map(row => row.split(","))
        .slice(1, -1)
        .reverse()

      setRecords(rows)
    }
    fetchData()
  }, [])

  const updateArrival = arrivalStation => {
    setArrivalStation(arrivalStation)
    setOriginStation("")
    setTrainNumber("")
  }

  const updateOrigin = originStation => {
    setOriginStation(originStation)
    setTrainNumber("")
  }
  const lookup = useMemo(() => getLookup(records), [records])

  const stats = getStats(lookup, arrivalStation, originStation, trainNumber)

  const filteredRecords = stats.filteredRecords.slice(0, 100)
  let stations = stats.availableStations
  let origins = stats.availableOrigins
  const trainNumbers = stats.availableTrainNumbers

  if (stations.includes(TORONTO)) {
    stations = [
      TORONTO,
      ...stations.filter(station => station !== TORONTO)
    ]
  }

  if (origins.includes(TORONTO)) {
    origins = [
      TORONTO,
      ...origins.filter(origin => origin !== TORONTO)
    ]
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
          <Grid container component="form" spacing={2} paddingTop={2}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={stations}
                value={arrivalStation}
                inputValue={arrivalStationInputValue}
                onChange={(e, value) => updateArrival(value)}
                onInputChange={(e, value) => setArrivalStationInputValue(value)}
                renderInput={(params) => <TextField {...params} label="Arrival Station" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                disabled={!arrivalStation}
                options={origins}
                value={originStation}
                inputValue={originStationInputValue}
                onChange={(e, value) => updateOrigin(value)}
                onInputChange={(e, value) => setOriginStationInputValue(value)}
                renderInput={(params) => <TextField {...params} label="Origin Station" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                disabled={!arrivalStation || !originStation}
                value={trainNumber}
                inputValue={trainNumberInputValue}
                onChange={(e, value) => setTrainNumber(value)}
                onInputChange={(e, value) => setTrainNumberInputValue(value)}
                filterOptions={createFilterOptions({ matchFrom: "start" })}
                options={trainNumbers}
                renderInput={(params) => <TextField {...params} label="Train Number" />}
              />
            </Grid>
          </Grid>
          <List>
            {
              records.length
                ? filteredRecords.map((row) => (
                  <ListItem key={row} sx={{ px: 0}}>
                    <Card
                      trainNumber={row[0]}
                      station={row[1]}
                      origin={row[2]}
                      minutesLate={Number(row[6])}
                      date={row[3]}
                    />
                  </ListItem>
                ))
                : Array.from({ length: 10 }).map((_, i) => (
                  <ListItem key={i} sx={{ px: 0}}>
                    <Skeleton variant='rounded' sx={{ width: "100%", maxWidth: "none" }}>
                        <Card />
                    </Skeleton>
                  </ListItem>
                ))
            }
          </List>
      </Container>
    </ThemeProvider>
  );
}

export default App;

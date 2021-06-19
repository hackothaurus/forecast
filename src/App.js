import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  field: {
    margin: theme.spacing(5),
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [timeZone, setTimeZone] = useState({});
  const [location, setLocation] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const apiCall = () => {
    Axios({
      method: "get",
      url: `http://api.weatherapi.com/v1/forecast.json?key=25fbb31ce9e64e449fa35256211906&q=Islamabad&days=10&aqi=no&alerts=no`,
      timeout: 10000,
    })
      .then((res) => {
        console.log(res.data);
        setWeather(res.data);
        //setQuery("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall();
  };

  useEffect(() => {
    const id = setInterval(apiCall, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography> Weather Forecast</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <TextField
              className={classes.field}
              id="outlined-basic"
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.field}
              onClick ={(e) => handleSubmit(e)}
            >
              Get weather forecast
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

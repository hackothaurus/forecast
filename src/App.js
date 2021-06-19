import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "1000px",
    flexGrow: 1,
    backgroundColor: "#fffbf2",
  },
  paper: {
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#dedede",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
  },
  boxpaper: {
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
    maxHeight: "280px",
  },
  boxpaper1: {
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
    overflow: "auto",
    maxHeight: "280px",
  },
  field: {
    margin: theme.spacing(5),
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");
  const [open, setOpen] = React.useState(false);
  const [hourly, setHourly] = React.useState(null);

  const apiCall = () => {
    var loc = location;
    Axios({
      method: "get",
      url:
        `http://api.weatherapi.com/v1/forecast.json?key=25fbb31ce9e64e449fa35256211906&q=` +
        loc +
        `&days=10&aqi=no&alerts=no`,
      timeout: 10000,
    })
      .then((res) => {
        setWeather(res.data);
      })
      .catch((err) => {
        if (typeof err == "undefined" && err.response.status === 400) {
          alert("Invalid input. Please write the correct name of the city");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall();
  };
  const array = [0];

  useEffect(() => {
    const id = setInterval(apiCall, 50000);
    return () => clearInterval(id);
  }, []);

  const hourForecast = (data) => {
    setHourly(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dialogData = (object) => {
    return hourly.hour.map((key, index) => {
      return (
        <div key={index}>
          <Avatar src={hourly.hour[index].condition.icon} />
          <h3>Time: {hourly.hour[index].time}</h3>
          <div>
            <p>Temperature: {hourly.hour[index].temp_c}</p>
            <p>Humidity: {hourly.hour[index].humidity}</p>
            <p>Wind: {hourly.hour[index].wind_mph}</p>
          </div>
        </div>
      );
    });
  };

  const returnForecast = () => {
    const array = [0];
    return (
      // weather.map((item)=>{console.log(item)})
      Object.keys(weather.forecast.forecastday).map((key, index) => {
        // console.log(weather.forecast.forecastday)
        return (
          <div key={index}>
            <Paper
              className={classes.paper}
              onClick={() => hourForecast(weather.forecast.forecastday[index])}
            >
              <Avatar
                src={weather.forecast.forecastday[index].day.condition.icon}
              />
              <h3>Date: {weather.forecast.forecastday[index].date}</h3>
              <div>
                <p>
                  Temperature:{" "}
                  {weather.forecast.forecastday[index].day.avgtemp_c}
                </p>
                <p>
                  Humidity:{" "}
                  {weather.forecast.forecastday[index].day.avghumidity}
                </p>
                <p>
                  Record high:{" "}
                  {weather.forecast.forecastday[index].day.maxtemp_c}
                </p>
                <p>
                  Record low:{" "}
                  {weather.forecast.forecastday[index].day.mintemp_c}
                </p>
              </div>{" "}
            </Paper>
          </div>
        );
      })
    );
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.boxpaper}>
            <Typography variant="h3"> Weather Forecast</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.boxpaper}>
            <Typography> Enter the city for a forecast:</Typography>
            <TextField
              className={classes.field}
              id="outlined-basic"
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.field}
              onClick={(e) => handleSubmit(e)}
            >
              Get weather forecast
            </Button>
          </Paper>
          {/* <Typography> {location}</Typography> */}
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.boxpaper}>
            <div>
              {weather &&
                Object.keys(array).map((key, index) => {
                  return (
                    <div key={index} align="center">
                      <h3>Current Weather</h3>
                      <h2>{weather.location.name}</h2>
                      <Avatar src={weather.current.condition.icon} />
                      <div>
                        <p>Temperature: {weather.current.temp_c}</p>
                        <p>Humidity: {weather.current.humidity}</p>
                        <p>Wind: {weather.current.wind_mph}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.boxpaper1}>
            <div>{weather ? returnForecast() : ""}</div>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Hourly Forecasts"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {hourly ? dialogData() : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

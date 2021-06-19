import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ReactDOM from "react-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

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
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [timeZone, setTimeZone] = useState({});
  const [location, setLocation] = useState("");

  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

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
        //console.log(res.data);
        setWeather(res.data);
        setCurrent({ current: weather.current });
        setForecast({ forecast: weather.forecast });
      })
      .catch((err) => {
        alert(err);
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
            <Typography> Enter the city for a forecast:</Typography>
            <TextField
              className={classes.field}
              id="outlined-basic"
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Paper>
          {/* <Typography> {location}</Typography> */}
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <Button
              variant="contained"
              color="primary"
              className={classes.field}
              onClick={(e) => handleSubmit(e)}
            >
              Get weather forecast
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper className={classes.list}>
            <List
              component="nav"
              className={classes.root}
              aria-label="mailbox folders"
            >
              <ListItem>
                <div>
                  {weather &&
                    Object.keys(array).map((key, index) => {
                      return (
                        <div key={index}>
                          <h3>Current Weather</h3>
                          <h2>{weather.location.name}</h2>

                          <div>
                            <p>👨: Temperature: {weather.current.temp_c}</p>
                            <p>📖: Humidity: {weather.current.humidity}</p>
                            <p>📖: Wind: {weather.current.wind_mph}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ListItem>
              <ListItem>
                <div>
                  {forecast &&
                    Object.keys(forecast.forecastday).map((key, index) => {
                      return (
                        <div key={index}>
                          <h3>Next Ten Days</h3>
                          <h2>{forecast.forecastday.date}</h2>

                          <div>
                            <p>👨: Temperature: {forecast.forecastday.day.avgtemp_c}</p>
                            <p>📖: Humidity: {forecast.forecastday.day.avghumidity}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

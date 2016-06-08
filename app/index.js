import React, {Component, PropTypes} from "react";
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from "redux";
import {combineReducers} from "redux";
import {Provider} from "react-redux";
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import {
  cyan500, deepOrange500, red500, grey400, grey500, grey600, grey700,
  transparent, lightWhite, white, darkWhite, lightBlack, black
} from 'material-ui/lib/styles/colors';
import Helmet from 'react-helmet';
import Main from './main';
import config from './config';

import {reducer as logged} from "./components/loggedin/loggedinActions";
import {reducer as geo} from "./components/geolocation/geolocationActions";
import {reducer as vehicles} from "./components/vehicles/vehiclesActions";
import {reducer as route} from "./components/route/routeActions";
import {reducer as map} from "./components/map-leaflet/mapActions";
import modelActions from './components/models/modelActions';

const users = modelActions('user').reducer;
const shops = modelActions('shop').reducer;
const products = modelActions('product').reducer;

// redux store
const store = createStore(
  combineReducers({
    logged,
    geo,
    vehicles,
    users,
    route,
    map,
    products,
    shops
  }),
  applyMiddleware(thunk)
);

// material design
const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    textColor: cyan500, // cyan500, deepOrange500, darkBaseTheme
    accent1Color: deepOrange500
  },
  appBar: {
    height: 50
  }
});

// head helmet
const head = {
  title: config.app.title,
  meta: [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'}
  ],
  link: [
//    {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'},
    {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400,300,500'},
    {rel: 'stylesheet', href: 'http://fonts.googleapis.com/icon?family=Material+Icons'},
    {rel: 'stylesheet', href: '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css'}
  ],
  script: [
//    {src: 'http://include.com/pathtojs.js', type: 'text/javascript'}
  ]
}

const styles = {
  container: {}
};

// inject tap
window.React = React;
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin(null);

// app with redux, mui theme and helmet
export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={styles.map}>
              <Helmet meta={head.meta} link={head.link} script={head.script}/>
              <Main/>
            </div>
          </MuiThemeProvider>
        </Provider>
      </div>
    )
  }
}

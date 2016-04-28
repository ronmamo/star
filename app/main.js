import React, { Component, PropTypes } from "react";
import Header from './components/header/Header';
import Route from './components/route/Route';
import LoggedIn from './components/loggedin/LoggedIn';
import GeoLocation from './components/geolocation/GeoLocation';
import VehicleSocket from "./components/vehicles/VehicleSocket";
import Map from "./components/map/Map";
import UsersDb from "./components/users/UsersDb";
import Users from "./components/users/Users";
import config from '../config';

export default class Main extends Component {

  render() {
    return (
      <div>
        <Header title={config.app.title}/>
        <LoggedIn>

          <GeoLocation/>
          <UsersDb/>

          <Route on='Map'>
            <VehicleSocket/>
            <Map/>
          </Route>

          <Route on='Users'>
            <Users/>
          </Route>

        </LoggedIn>
      </div>
    )
  }
}

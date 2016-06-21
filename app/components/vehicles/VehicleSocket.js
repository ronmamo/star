import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as vehicleActions from "./vehiclesActions";

const createVehicle = vehicle => {
  vehicle.name = `${vehicle.type} ${vehicle.routeNumber}`;
  vehicle.id = vehicle.vehicleID;
  return vehicle;
}

try {
  if (window.navigator && Object.keys(window.navigator).length == 0) {
    window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
  }
}
catch (err) {
  console.log("could not set userAgent")
}

var io = require("socket.io-client/socket.io");

@connect(state => ({
}), (dispatch, props) => bindActionCreators(vehicleActions, dispatch))
export default class VehicleSocket extends Component {

  componentDidMount() {
    console.log("connecting socket");
    this.socket = io('http://pdx-livebus.rhcloud.com:8000', {
      transports: ['websocket']
    });
    this.socket.on('vehicles_update', data => {
      const vehicles = data.map(vehicle => createVehicle(vehicle));
      this.props.updateVehicles(vehicles);
    });
  }

  componentWillUnmount() {
    console.log("disconnecting socket");
    this.socket.disconnect();
  }

  render() {
    return null;
  }
}

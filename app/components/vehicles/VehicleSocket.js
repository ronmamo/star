import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as vehicleActions from "./vehiclesActions";


if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

var io = require("socket.io-client/socket.io");

@connect(state => state,
  (dispatch, props) => bindActionCreators(vehicleActions, dispatch))
export default class VehicleSocket extends Component {

  componentDidMount() {
    console.log("connecting socket");
    this.socket = io('http://pdx-livebus.rhcloud.com:8000', {
      transports: ['websocket']
    });
    this.socket.on('vehicles_update', (data) => this.props.updateVehicles(data));
  }

  componentWillUnmount() {
    console.log("disconnecting socket");
    this.socket.disconnect();
  }

  render() {
    return null;
  }
}

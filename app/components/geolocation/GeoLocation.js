import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as geoActions from "./geolocationActions";

if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

@connect(
  state => state,
  (dispatch, props) => bindActionCreators(geoActions, dispatch))
export default class GeoLocation extends Component {

  state = {
    watchId: 0
  };

  componentDidMount() {
    // Geolocation Control
    this.geolocation = navigator.geolocation || false;
    let geolocation = this.geolocation;
    if (geolocation) {
      geolocation = navigator.geolocation;
      this.watchId = geolocation.watchPosition(this.geoSuccess, this.geoError);
    }
  }

  componentWillUnmount() {
    this.geolocation = navigator.geolocation || false;
    if (this.geolocation && this.state.watchId > 0) {
      this.geolocation.clearWatch(this.state.watchId);
    }
  }

  geoSuccess = position => {
    console.log("geoSuccess", position);
    this.props.updateLocation(position);
    this.setState({ watchId: this.watchId });
  };

  geoError = () => {
    console.log('Sorry, geolocation is not available.');
  };

  render() {
    return null;
  }
}

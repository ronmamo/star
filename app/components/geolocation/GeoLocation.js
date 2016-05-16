import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as geoActions from "./geolocationActions";
import * as loggedinActions from "../loggedin/loggedinActions";

const createLocation = position => {
  const location = position.coords;
  return {
    accuracy: location.accuracy,
    altitude: location.altitude,
    altitudeAccuracy: location.altitudeAccuracy,
    heading: location.heading,
    latitude: location.latitude,
    longitude: location.longitude,
    speed: location.speed
  }
}

if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, { navigator: { userAgent: 'ReactNative' }});
}

@connect(state => ({
  location: state.geo.location
}), (dispatch, props) => bindActionCreators({...geoActions, ...loggedinActions}, dispatch))
export default class GeoLocation extends Component {

  state = {
    watchId: 0
  };

  componentDidMount() {
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
    const location = createLocation(position);
    this.props.updateLocation(location);
    this.setState({ watchId: this.watchId });
  };

  geoError = () => {
    console.log('Sorry, geolocation is not available.');
  };

  render() {
    return null;
  }
}

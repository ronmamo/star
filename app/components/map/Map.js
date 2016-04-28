import React, { Component } from "react";
import { connect } from "react-redux";
import { Map, Marker, TileLayer } from 'react-leaflet';
import classnames from "classnames";
import { divIcon, point } from "leaflet";

import MapCss from "./Map.css";

const styles = {
  cover: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
  }
}

const defaultPosition = [
  32.000,
  34.000,
];

const hash = (string) => {
  var hash = 0;
  for (var i = 0; i < string.length; i++) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export const createMarker = (type, name, location) => {
//  console.log("create marker", name, location);
  return {
    routeNumber: name,
    key: name,
    type: type,
    latitude: location.latitude,
    longitude: location.longitude
  }
}

@connect(state => ({
  vehicles: state.vehicles,
  location: state.geo.location,
  users: state.users.users
}))
export default class MapLeaf extends Component {

  render() {
    // center
    const { location } = this.props;
    const center = location && location.coords ? [location.coords.latitude, location.coords.longitude] : defaultPosition;

    // add markers
    let markers = Object.assign(this.props.vehicles) || [];
    const userMarkers = Object.keys(this.props.users).map(key => this.props.users[key])
      .map(user => createMarker('bus', user.username, (user.location.latitude ? user.location : location.coords)));
    markers = Object.assign(markers, userMarkers);

    // apply marker view
    markers.map(marker => {
      const { routeNumber, type } = marker;
      let classes = {
        [MapCss.marker]: true
      }
      if (type == 'rail') {
        classes[MapCss[`rail${routeNumber}`]] = true;
      } else if (type == 'bus') {
        classes[MapCss.bus] = true;
      }
      marker.icon = divIcon({ className: classnames(classes), html: `<span>${marker.routeNumber}</span>`});
    })

    return (
      <Map center={center} zoom={13} style={styles.cover}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        { markers.map(marker =>
          <Marker icon={marker.icon} key={marker.key || marker.vehicleID} position={[marker.latitude, marker.longitude]} />
        )}

      </Map>
    )
  }
}

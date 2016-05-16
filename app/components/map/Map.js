import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "./mapActions";

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
  32.050,
  34.800,
];

export const createMarker = (type, origin, name, location) => {
//  console.log("create marker", name, location);
  return {
    key: name,
    type: type,
    origin: origin,
    routeNumber: name,
    latitude: location.latitude,
    longitude: location.longitude
  }
}

@connect(state => ({
  vehicles: state.vehicles,
  location: state.geo.location,
  users: state.users.users,
  center: state.map.center
}), (dispatch, props) => bindActionCreators(mapActions, dispatch))
export default class MapLeaf extends Component {

  // todo shouldRender only if markers changed in current region

  onDragEnd = (e, marker) => {
    console.log('e', e);
    console.log('origin', marker);
    const dom = this.refs[marker.key];
    console.log('dom', dom);

  }

  onClick = (e, marker) => {
    this.props.setCenter(marker);
  }

  render() {
    // center
    const { location, center } = this.props;
    const mapCenter = center ? [center.latitude, center.longitude]
      : location && location.coords ? [location.coords.latitude, location.coords.longitude]
      : defaultPosition;

    // add markers
    const { vehicles, users } = this.props;
    let markers = Object.assign(vehicles) || [];
    const userMarkers = users && Object.keys(users).map(key => users[key])
      .map(user => createMarker('bus', user, user.username, (user.location.latitude ? user.location : location.coords)));
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
      <Map center={mapCenter} zoom={13} style={styles.cover}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        { markers.map((marker, index) =>
          <Marker icon={marker.icon} key={marker.key || marker.vehicleID}
            ref={marker.key}
            position={[marker.latitude, marker.longitude]}
            draggable={true}
            zIndexOffset={index}
            opacity={0.8}
            onDragEnd={e => this.onDragEnd(e, marker)}
            onClick={e => this.onClick(e, marker)}
          />
        )}

      </Map>
    )
  }
}

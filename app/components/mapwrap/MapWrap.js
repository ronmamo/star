import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Map from '../map/Map';
import * as mapActions from "../map/mapActions";

const createMarker = (type, origin, name, latitude, longitude) => {
  // console.log("create marker", type, name);
  return {
    type: type,
    origin: origin,
    routeNumber: name,
    latitude: latitude,
    longitude: longitude
  }
}

export const vaules = object => Object.keys(object).map(key => object[key]);

@connect(state => ({
  users: state.users.list,
  shops: state.shops.list,
  vehicles: state.vehicles,
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators({...mapActions}, dispatch))
export default class MapWrap extends Component {

  render() {
    // add markers
    const {vehicles, users} = this.props;
    let markers = [];
    if (users) {
      markers = markers.concat(vaules(users).map(user =>
        createMarker('bus', user, user.username, user.latitude, user.longitude)));
    }
    if (vehicles) {
      markers = markers.concat(vaules(vehicles).map(vehicle =>
        createMarker(vehicle.type, vehicle.origin, vehicle.routeNumber, vehicle.latitude, vehicle.longitude)));
    }

    return <Map markers={markers}/>
  }
}

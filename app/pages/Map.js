import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Map, * as Markers from '../components/map-leaflet/Map';
import * as mapActions from "../components/map-leaflet/mapActions";

/**
 * map view, different marker types
 */
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
      markers = markers.concat(Markers.createMarkers(users, 'user'));
    }
    if (vehicles) {
      markers = markers.concat(Markers.createMarkers(vehicles).map(vehicle =>
        Markers.createMarker(vehicle.id, vehicle.routeNumber, vehicle.type, vehicle.origin, vehicle.latitude, vehicle.longitude)));
    }

    return <Map markers={markers}/>
  }
}

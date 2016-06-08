import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as mapActions from "../components/map-leaflet/mapActions";
import * as routeActions from "../components/route/routeActions";
import Map, * as Markers from '../components/map-leaflet/Map';

/**
 * map view from socket data, with popup
 */
@connect(state => ({
  vehicles: state.vehicles
}), (dispatch, props) => bindActionCreators({...mapActions, ...routeActions}, dispatch))
export default class Vehicles extends Component {

  state = {
    currentVehicle: null,
    popups: []
  }

  componentWillUpdate(nextProps, nextState) {
    // center map to default vehicle
    if (!nextState.currentVehicle && !this.state.currentVehicle) {
      if (nextProps.vehicles && nextProps.vehicles[0]) {
        const vehicle = nextProps.vehicles[0];
        this.setState({currentVehicle: vehicle});
        this.props.setCenter({latitude: vehicle.latitude, longitude: vehicle.longitude});
      }
    }
  }

  onClick = (e, marker) => {
    this.props.setCenter({latitude: marker.latitude, longitude: marker.longitude});
    this.setState({currentVehicle: marker.origin})
    this.setState({popups: Object.assign(this.state.popups, <VehiclePopup model={marker.origin}/>)});
  }

  render() {
    const vehicles = this.props.vehicles || {};
    const markers = vehicles.map(v => Markers.createMarker(v.id, v.routeNumber, v.type, v, v.latitude, v.longitude));
    return (
      <div>
        <Map markers={markers} popup={this.state.popup} onClick={this.onClick}/>
      </div>
    );
  }
}

const VehiclePopup = (model) => (
  <span><h3>{model.name}</h3><span>vehicle #{model.id}</span></span>
)
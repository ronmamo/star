import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "../map/mapActions";
import * as routeActions from "../route/routeActions";

import AutoComplete from 'material-ui/lib/auto-complete';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/TextField';
import Place from 'material-ui/lib/svg-icons/maps/place';
import config from '../../config';

@connect(state => ({
  vehicles: state.vehicles
}))
export default class Vehicles extends Component {

  onNewRequest = (t) => {
    console.log(t)
  }

  render() {
    const vehicles = this.props && this.props.vehicles || {};
    const vehiclesDs = vehicles.map(vehicle => `${vehicle.type} ${vehicle.routeNumber}`)
    return (
      <div>
        <AutoComplete
          floatingLabelText="Vehicles"
          filter={AutoComplete.fuzzyFilter}
          onNewRequest={this.onNewRequest}
          dataSource={vehiclesDs}
        />
        {
          Object.keys(vehicles).map(key => vehicles[key])
          .map((vehicle, index) => <VehicleCard key={index} vehicle={vehicle}/>)
        }
      </div>
    );
  }
}

@connect(state => ({}),
  (dispatch, props) => bindActionCreators({...mapActions, ...routeActions}, dispatch))
class VehicleCard extends Component {

  static propTypes = {
    vehicle: PropTypes.object.isRequired
  }

  onCardClick = e => {
    console.log("on card click", e);
  }

  showOnMap = e => {
    this.props.setCenter(this.props.vehicle);
    this.props.doRoute(config.app.routes.Map);
  }

  render() {
    const { vehicle } = this.props;
    return (
      <Card>
        <CardHeader
          title={vehicle.routeNumber}
          subtitle={vehicle.type}
          actAsExpander={true}
          showExpandableButton={true}
          onTouchTap={e => this.onCardClick(e)}
        />
        <CardText expandable={true}>
          <TextField
            defaultValue="Default Value"
          /><br/>
          Latit
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="Show on map" icon={<Place />} onClick={e => this.showOnMap(e)}/>
          <FlatButton label="Action2"/>
        </CardActions>
      </Card>);
  }
}
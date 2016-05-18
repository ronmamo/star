import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as mapActions from "../map/mapActions";
import * as routeActions from "../route/routeActions";
import {ModelViewBar, ModelCardView} from '../models/ModelView';
import config from '../../config';

@connect(state => ({
  vehicles: state.vehicles
}), (dispatch, props) => bindActionCreators({...mapActions, ...routeActions}, dispatch))
export default class Vehicles extends Component {

  onSearch = (t) => {
    console.log(t)
  }

  onShow = (e, model) => {
    if (model.latitude) {
      this.props.setCenter({latitude: model.latitude, longitude: model.longitude});
      this.props.doRoute(config.app.routes.Map);
    }
  }

  render() {
    const vehicles = this.props.vehicles || {};
    const names = vehicles.map(vehicle => vehicle.name);
    return (
      <div>
        <ModelViewBar searchList={names}
                      onSearch={this.onSearch}/>
        { Object.keys(vehicles).map(key => vehicles[key])
          .map((vehicle, index) =>
            <ModelCardView model={vehicle}
                           key={vehicle.id}
                           fields={['routeNumber', 'latitude', 'longitude']}
                           expandMode={true}
                           onCardClick={props => {}}
                           onEdit={props => {}}
                           onShow={this.onShow}/>)
        }
      </div>
    );
  }
}

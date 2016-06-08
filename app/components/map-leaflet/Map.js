import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as mapActions from "./mapActions";

import {Map, Marker, TileLayer, Popup} from 'react-leaflet';
import classnames from "classnames";
import {divIcon, point} from "leaflet";

import MapCss from "./Map.css";

export const createMarker = (id, name, type, origin, latitude, longitude) => {
  // console.log("create marker", type, name);
  return {
    id: id,
    name: name,
    type: type,
    origin: origin,
    latitude: latitude,
    longitude: longitude
  }
}

export const marker = (model, type = 'bus') => {
  return createMarker(model.id, model.name, type, model, model.latitude, model.longitude);
}

export const createMarkers = (models, type = 'bus') => {
  return values(models).map(shop => marker(shop, shop.type || type));
}

export const values = (models) => {
  return Object.keys(models).map(key => models[key]);
}

export const createPopup = (model, content) => {
  return {
    latitude: model.latitude,
    longitude: model.longitude,
    content: content
  };
}

const styles = {
  cover: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
  }
}

const defaultPosition = {
  latitude: 32.050,
  longitude: 34.800
}

@connect(state => ({
  location: state.geo.location,
  globalCenter: state.map.center
}), (dispatch, props) => bindActionCreators(mapActions, dispatch))
export default class MapLeaf extends Component {

  static propTypes = {
    markers: PropTypes.array,
    popups: PropTypes.array,
    onClick: PropTypes.func,
    zoom: PropTypes.number,
    center: PropTypes.object
  }

  // todo shouldRender only if markers changed in current region

  onDragEnd = (e, marker) => {
    console.log('e', e);
    console.log('origin', marker);
    const dom = this.refs[marker.key];
    console.log('dom', dom);

  }

  onClick = (e, marker) => {
    this.props.onClick ? this.props.onClick(e, marker) : this.props.setCenter(marker);
  }

  render() {
    // center
    const {globalCenter, center, location, popups} = this.props;
    const point = globalCenter || center || location && location.latitude && location || defaultPosition;
    const mapCenter = [point.latitude, point.longitude];

    // add markers
    const {markers} = this.props;
    markers.map((marker, index) => {
      const {name, type} = marker;
      let classes = {
        [MapCss.marker]: true
      }
      if (type == 'rail') {
        classes[MapCss[`rail${name}`]] = true;
      } else if (type == 'bus') {
        classes[MapCss.bus] = true;
      } else if (type) {
        classes[MapCss[type]] = true;
      }
      marker.icon = divIcon({className: classnames(classes), html: `<span>${marker.name}</span>`});
      marker.key = index;
    })

    return (
      <Map center={mapCenter} zoom={this.props.zoom || 13}
           style={Object.assign({}, styles.cover, this.props.style)}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        { markers.map((marker, index) =>
          <Marker icon={marker.icon}
                  key={marker.id}
                  position={[marker.latitude, marker.longitude]}
                  draggable={true}
                  zIndexOffset={index}
                  opacity={0.8}
                  onDragEnd={e => this.onDragEnd(e, marker)}
                  onClick={e => this.onClick(e, marker.origin)}
          />
        )}
        { popups && popups.map(popup =>
          <Popup position={[popup.latitude, popup.longitude]}>
            {popup.content}
          </Popup>
        ) }

      </Map>
    )
  }
}

import React, { Component, View, Text, Animated, StyleSheet} from "react-native";
import classnames from "classnames";
import { connect } from "react-redux";
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import map from "lodash/map";
import MapView from 'react-native-maps';


const position = {
  lat: 45.5200,
  lng: -122.6716007,
};


const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})


class NativeApp extends Component {
  render() {
    const { vehicles } = this.props;
    return (
      <div style={styles.container}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: position.lat,
              longitude: position.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {
              map(vehicles, (vehicle) => {
                const { routeNumber, type, latitude, longitude, vehicleID } = vehicle;
                const coordinate = { latitude, longitude };

                return (
                  <VehicleMarker key={vehicleID} coordinate={coordinate} routeNumber={routeNumber} type={type} />
                );

              })
            }
          </MapView>
        </View>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      vehicles: state.vehicles
    }
}
export default connect(mapStateToProps)(NativeApp)

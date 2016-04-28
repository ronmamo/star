import React, { Component, View, Text, Animated, StyleSheet} from "react-native";
import { Marker } from 'react-native-maps';


export default class MapMarker extends Component {
  render() {
    const { routeNumber, vehicleID, coordinate, type } = this.props;
    let style;

    if (type == 'rail') {
      style = styles[`rail${routeNumber}`]
    } else {
      style = styles.bus;
    }


    return (
      <Marker coordinate={coordinate}>
        <View style={[styles.marker, style]}>
          <Text style={styles.text}>{routeNumber}</Text>
        </View>
      </Marker>
    )
  }
}

const styles = StyleSheet.create({
  marker: {
    borderWidth: 1,
    borderColor: '#FFF',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  bus: {
    backgroundColor: '#333'
  },
  rail90: {
    backgroundColor: '#D11241'
  },
  rail100: {
    backgroundColor: '#0069AA'
  },
  rail190: {
    backgroundColor: '#FFC423'
  },
  rail200: {
    backgroundColor: '#008752'
  },
  rail290: {
    backgroundColor: '#D25D13'
  }
})

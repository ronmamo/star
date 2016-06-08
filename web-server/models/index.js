import Sequelize from 'sequelize';
import user from './user';
import shop from './shop';

export default { user, shop } // ordered

export const withLocation = {
  accuracy: Sequelize.DECIMAL,
  altitude: Sequelize.DECIMAL,
  altitudeAccuracy: Sequelize.DECIMAL,
  heading: Sequelize.DECIMAL,
  latitude: Sequelize.DECIMAL,
  longitude: Sequelize.DECIMAL,
  speed: Sequelize.DECIMAL
}

export const withImage = {
  image: Sequelize.BLOB
}

// export const withGis = {
//   location: Sequelize.GEOMETRY
// }
//
// export const withLatLng = Object.assign(withLatLng, withGis)
//
// export const withLocation = withLatLng

import Sequelize from 'sequelize';
import {withLocation, withImage} from './index';

export default sequelize => {

  var User = sequelize.define('user', Object.assign(withLocation, withImage, {
    name: Sequelize.STRING,
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    email: Sequelize.STRING,
    extId: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    state: {
      type: Sequelize.ENUM,
      values: ['active', 'pending', 'deleted']
    }
  }));
}

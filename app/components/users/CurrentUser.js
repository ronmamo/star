import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import _ from 'lodash';
import modelActions from "../models/modelActions";
import * as loggedinActions from "../loggedin/loggedinActions";

@connect(state => ({
  currentUser: state.logged.currentUser,
  location: state.geo.location
}), (dispatch, props) => bindActionCreators({...modelActions('user').actions, ...loggedinActions}, dispatch))
export default class CurrentUser extends Component {

  componentWillUpdate(nextProps, nextState) {
    const currentLocation = this.props.location;
    const nextLocation = nextProps.location;

    // update current user when changed
    const currentUser = this.props.currentUser;
    const nextUser = nextProps.currentUser;

    const userChange = this.isChange(nextUser, currentUser);
    const locationChange = this.isChange(nextLocation, currentLocation);

    if (userChange || locationChange || !nextUser.id) {
      console.log('user/location changed', userChange, nextLocation);

      let user = Object.assign(nextUser);
      if (locationChange) {
        user = Object.assign(user, nextLocation);
      }
      if (user && !user.id) {
        this.findUserByUsername(user.username)
          .then(found => {
            if (found) {
              user.id = found.id;
              console.log('found user by username, updated next user id', user.id);
              this.props.updateCurrentUser(user);
            } else {
              this.upsertCurrentUser(user);
            }
          })
          .catch(error => console.log('could not find user by username', error));
      } else if (user && user.id) {
        this.upsertCurrentUser(user);
      }
    } 
  }

  isChange = (next, current) => {
    let change = _.reduce(next, (result, value, key) => {
      return _.isEqual(value, current[key]) ?
        result : result.concat(key);
    }, []);
    return change.length != 0 && change;
  }


  findUserByUsername = (username) =>
    this.props.find({where: {username: username}}).promise.then(res => res.json())
      .then(json => {
        if (Array.isArray(json.result) && json.result.length == 1) {
          return json.result[0];
        }
      })
      .catch(error => console.log('error', error));

  upsertCurrentUser = user =>
    this.props.update(user).promise.then(response => response.json())
      .then(result => result.created && this.props.updateCurrentUser(result.created))
      .catch(error => console.log('could not update or create user', user));

  render() {
    return null;
  }
}

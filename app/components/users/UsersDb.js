import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersActions from "./usersActions";

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

const defaultPosition = {
  latitude: 32.125,
  longitude: 34.815
}

const createUser = (profile, location) => {
//  console.log("create user", profile);
  return {
    username: profile.getName(),
    email: profile.getEmail(),
    location
  }
}

@connect(state => ({
  currentUser: state.logged.currentUser,
  location: state.geo.location,
  users: state.users.users
}), (dispatch, props) => bindActionCreators(usersActions, dispatch))
export default class Users extends Component {

  componentWillMount() {
    // find users
    const query = { limit: 10 };
    console.log("find users", query);
    this.props.findUsers(query).promise.then(response => response.json())
    .then(data => {
      const users = data.map(user => user.value);
      this.props.setUsers(users);
      this.setState({users}); // todo is needed for proper refresh on first load?
    })
    .catch(error => console.log("error", error));

    // get user by name
//    console.log("get user by name");
//    this.props.getUser(name).promise.then(response => response.json())
//    .then(json => console.log("get user", json))
//    .catch(error => console.log("error", error));
  }

  componentWillUpdate(nextProps, nextState) {
    const currentUser = this.props.currentUser;
    const nextUser = nextProps.currentUser;
    const userChanged = nextUser.username !== currentUser.username;

    const currentLocation = this.props.location.coords || defaultPosition;
    const nextLocation = nextProps.location.coords || defaultPosition;
    const locationChanged = nextLocation.latitude !== currentLocation.latitude ||
      nextLocation.longitude !== currentLocation.longitude;
    if (userChanged || locationChanged) {
      if (locationChanged) {
        console.log("location changed", nextLocation);
      }
      if (userChanged) {
        console.log("user changed", nextUser);
      }
      const location = { latitude: nextLocation.latitude, longitude: nextLocation.longitude };
      const user = createUser(nextUser.getBasicProfile(), location);
      console.log("update current user", user);
      this.props.updateUsers([user]).promise.then(response => response.json())
      .then(result => console.log("update result", result))
      .catch(error => console.log("error", error));
    }
  }

  render() {
    return null;
  }
}

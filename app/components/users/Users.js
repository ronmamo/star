import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as usersActions from "./usersActions";

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

const createUser = (profile, location) => {
  return {
    username: profile.getName(),
    email: profile.getEmail(),
    location
  }
}

@connect(state => ({
  users: state.users.users
}))
export default class Users extends Component {

  render() {
    const users = this.props && this.props.users || {};
    return (
      <div>
        {
          Object.keys(users).map(key => users[key])
          .map(user => <UserCard key={user.username} user={user}/>)
        }
      </div>
    );
  }
}

class UserCard extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired
  }

  onCardClick = e => {
    console.log("on card click", e);
  }

  render() {
    const { user } = this.props;
    return (
      <Card key={user.username}>
        <CardHeader
          title={user.username}
          subtitle={user.email}
          actAsExpander={true}
          showExpandableButton={true}
          onTouchTap={e => this.onCardClick(e)}
        />
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="Action1"/>
          <FlatButton label="Action2"/>
        </CardActions>
      </Card>);
  }
}
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ModelView from "../models/ModelView";

@connect(state => ({
  users: state.users.list,
  selectedUser: state.users.current
}))
export default class Users extends Component {

  render() {
    // {...this.props} is needed to pass down the dispatch
    return <ModelView {...this.props}
      name="user"
      models={this.props.users}
      current={this.props.selectedUser}
      fields={['username', 'email', 'latitude', 'longitude']}
    />
  }
}

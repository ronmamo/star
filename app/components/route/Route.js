import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

@connect(state => ({
  route: state.route.route
}))
export default class Route extends Component {

  isRoute() {
    return this.props.on === this.props.route;
  }

  render() {
    return this.isRoute() ? <div>{this.props.children}</div> : null;
  }
}


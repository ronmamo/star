import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ModelView from "../models/ModelView";

@connect(state => ({
  shops: state.shops.list,
  currentShop: state.shops.current
}))
export default class Shops extends Component {

  render() {
    return <ModelView {...this.props}
      name="shop"
      models={this.props.shops}
      current={this.props.currentShop}
      options={{ edit: true, add: true }}
    />
  }
}

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ModelView from "../models/ModelView";

@connect(state => ({
  products: state.products.list,
  currentProduct: state.products.current
}))
export default class Products extends Component {

  render() {
    // {...this.props} is needed to pass down the dispatch
    return <ModelView {...this.props}
      name="product"
      models={this.props.products}
      current={this.props.currentProduct}
      options={{ edit: true, add: true }}
    />
  }
}

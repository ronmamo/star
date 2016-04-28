import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loggedinActions from "./loggedinActions";
import config from '../../../config';

const styles = {
  container: {
    align: 'center',
    textAlign: 'center',
    paddingTop: 200,
  },
}

const getAuthInstance = () => {
  return window.gapi ? window.gapi.auth2.getAuthInstance() : null;
}

@connect(state => ({
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators(loggedinActions, dispatch))
export default class LoggedIn extends Component {

  onLogin = response => {
    const currentUser = getAuthInstance().currentUser.get();
    console.log("onLogin", response, currentUser);
    this.props.loggedIn(response.code, currentUser);
  }

  render() {
    const { currentUser } = this.props;
    const isLoggedIn = currentUser && loggedinActions.isLoggedIn();
    const clientId = config.app.googleAppId;

    return isLoggedIn ? <div>{this.props.children}</div> : (
      <div style={styles.container}>
        <h1>Login</h1>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          callback={this.onLogin}
          offline={true}
        />
      </div>
    );
  }
}


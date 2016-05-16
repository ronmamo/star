import React, {Component, PropTypes} from "react";
import GoogleLogin from 'react-google-login';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as loggedinActions from "./loggedinActions";
import * as routeActions from "../route/routeActions";
import config from '../../config';

const createUser = (profile) => {
  return {
    name: profile.getName(),
    username: profile.getEmail(),
    email: profile.getEmail(),
    extId: profile.getId(),
    imageUrl: profile.getImageUrl()
  }
}

const styles = {
  container: {
    align: 'center',
    textAlign: 'center',
    paddingTop: 200
  }
}

@connect(state => ({
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators({...loggedinActions, ...routeActions}, dispatch))
export default class LoggedIn extends Component {

  static propTypes = {
    route: PropTypes.object
  }

  onLogin = response => {
    const currentUser = loggedinActions.getAuthInstance().currentUser.get();
    console.log("onLogin", response, currentUser);
    if (currentUser) {
      const user = createUser(currentUser.getBasicProfile());
      this.props.loggedIn(response.code, user);
      if (this.props.route) {
        this.props.doRoute(this.props.route);
      }
    }
  }
  
  render() {
    const {currentUser} = this.props;
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


import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as loggedinActions from "./loggedinActions";
import * as routeActions from "../route/routeActions";
import {RaisedButton} from "material-ui/lib";
import GoogleLogin from 'react-google-login';
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
  map: {
    align: 'center',
    textAlign: 'center',
    paddingTop: 200
  }
}

/**
 * login using google for a given googleAppId, show this.props.children when authenticated
 */
@connect(state => ({
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators({...loggedinActions, ...routeActions}, dispatch))
export default class LoggedIn extends Component {

  state = {}
  static propTypes = {
    googleAppId: PropTypes.string,
    guest: PropTypes.bool,
    route: PropTypes.object
  }

  onLogin = response => {
    const currentUser = loggedinActions.getAuthInstance().currentUser.get();
    console.log("onLogin", response, currentUser);
    if (currentUser) {
      const user = createUser(currentUser.getBasicProfile());
      this.login(response.code, user);
    }
  }

  login(token, user) {
    this.props.loggedIn(token, user);
    if (this.props.route) {
      this.props.doRoute(this.props.route);
    }
  }

  onGuestLogin = e => {
    this.login('', {id: -1, name: 'guest'});
  }

  render() {
    const {currentUser} = this.props;
    const isLoggedIn = currentUser && loggedinActions.isLoggedIn();
    const googleAppId = this.props.googleAppId || config.app.googleAppId;

    return isLoggedIn ? <div>{this.props.children}</div> : (
      <div style={styles.map}>
        <h1>Login</h1>
        { googleAppId &&
        <div>
          <GoogleLogin clientId={googleAppId}
                       buttonText="Login with Google"
                       callback={this.onLogin}
                       offline={true}/>
        </div>
        }
        { this.props.guest !== false &&
        <div>
          <br/>
          <RaisedButton label="Continue as Guest" onTouchTap={this.onGuestLogin}/>
        </div>
        }
      </div>
    );
  }
}


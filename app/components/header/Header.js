import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loggedinActions from "../loggedin/loggedinActions";
import * as routeActions from "../route/routeActions";
import config from '../../../config';

import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import Stars from 'material-ui/lib/svg-icons/action/stars';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';

const styles = {
  title: {
    cursor: 'pointer'
  }
};

@connect(state => ({
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators({...loggedinActions, ...routeActions}, dispatch))
export default class Header extends Component {

  onLogout() {
    const { currentUser } = this.props;
    this.props.logout().promise.then(() => {
      console.log("logout", currentUser);
    });
  }

  render() {
    const { title, currentUser } = this.props;
    const isLoggedIn = currentUser && loggedinActions.isLoggedIn();
    let menuItems = [];
    if (isLoggedIn) {
      menuItems = config.app.routes.map(route =>
        <MenuItem key={route} primaryText={route} onClick={e => this.props.doRoute(route)} />);
    }

    return (
      <AppBar
        title={title}
        titleStyle={styles.title}
        iconElementLeft={<IconButton><Stars /></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            { menuItems }
          </IconMenu>
        }
      />
    );
  }
}


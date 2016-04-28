import React, { Component, PropTypes } from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  title: {
    cursor: 'pointer',
  }
};

export default class Header extends Component {

  handleTouchTap() {
    alert('onTouchTap triggered on the title component');
  }

  render() {
    const { title } = this.props;
    return (
      <AppBar
        title={<span style={styles.title}>{title}</span>}
        onTitleTouchTap={(e) => this.handleTouchTap(e)}
        onClick={(e) => this.handleTouchTap(e)}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help" />
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        }
      />
    );
  }
}


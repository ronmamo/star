import React, {Component, PropTypes} from "react";
import {Paper, EnhancedButton} from "material-ui/lib";
import {deepOrange500, grey600, black} from 'material-ui/lib/styles/colors';

const styles = {
  bar: {
    position: 'fixed',
    left: 0,
    right: 0,
    width: '100%',
    bottom: 0,
  },
  button: {
    height: 56,
    zIndex: 1
  },
  selected: {
    color: deepOrange500,
    fontSize: 15
  },
  unselected: {
    color: grey600,
    fontSize: 13
  },
  label: {
    marginTop: '-3px',
    transition: 'all 0.3s',
    color: black
  },
  icon: {
    marginTop: '2px'
  }
}

/**
 * bottom navigation bar with configurable items, such as `{Add: {Icon: icon, action: action}, ...}`
 */
export default class Bottom extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    onTouchTap: PropTypes.func,
    selectable: PropTypes.bool,
    initial: PropTypes.string
  }

  state = {
    selected: this.props.initial
  }

  onTouchTap = (e, key) => {
    if (this.props.selectable) {
      this.setState({selected: key});
    }
    const item = this.props.items[key];
    const action = item.action;
    if (this.props.onTouchTap) {
      this.props.onTouchTap(e, action);
    } else if (action) {
      action(e);
    }
  }

  render() {
    const {items} = this.props;
    const width = 100 / Object.keys(items).length + '%';

    return (
      <Paper style={styles.bar} zDepth={1} zIndex={1100}>
        { Object.keys(items).map(key => {
          const selected = this.state.selected === key;
          const style = selected ? styles.selected : styles.unselected;
          const Icon = items[key].Icon;

          return (
            <EnhancedButton key={key}
                            selected={selected}
                            style={Object.assign({}, styles.button, style, {width: width} )}
                            onTouchTap={e => this.onTouchTap(e, key)}>
              <Icon style={Object.assign({}, styles.icon, style)}/>
              <div style={Object.assign({}, styles.label, style)}>{key}</div>
            </EnhancedButton>
          )
        })}
      </Paper>
    )
  }
}

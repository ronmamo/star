import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import viewActions from "../components/models/viewActions";
import modelActions from "../components/models/modelActions";
import Bottom from '../components/bottom/Bottom';
import AvatarCardView from '../components/view-card/AvatarCardView';
import CardEditView from '../components/view-card/CardEditView';
import {
  RaisedButton, FlatButton, AutoComplete, Snackbar, Dialog, FontIcon,
  Table, TableHeader, TableHeaderColumn, TableRow, Paper, EnhancedButton
} from "material-ui/lib";
import {
  SocialGroupAdd, ActionFavorite, ActionFavoriteBorder, MapsNearMe
} from "material-ui/lib/svg-icons";

/**
 * card view with avatar, search bar, switch to edit view, add/edit/delete actions,
 *   bottom navigation bar, and show on map action
 */
@connect(state => ({
  users: state.users.list,
  currentUser: state.users.current
}))
export default class Users extends Component {

  state = {
    fields: ['username', 'email', 'description'],
    editFields: ['name', 'username', 'email', 'description', 'latitude', 'longitude']
  }

  // todo bind on @connect, remove this constructor completely
  constructor(props) {
    super(props);
    this.modelActions = bindActionCreators({...modelActions('user').actions}, props.dispatch);
    this.viewActions = viewActions('user', this);
  }

  componentWillMount() {
    this.viewActions.onLoad();
  }

  render() {
    const {models, fields, editFields, mode, selected, editModel, dialog, message} = this.state;
    const names = models ? Object.keys(models).map(key => models[key].name) : [];

    const items = mode == 'view' && {
        Add: {Icon: SocialGroupAdd, action: this.viewActions.onAdd},
        Nearby: {Icon: MapsNearMe},
        Favorites: {Icon: ActionFavorite}
      };

    return (
      <div>
        { mode == 'view' &&
        <div>
          <AutoComplete dataSource={names} floatingLabelText="Search" filter={AutoComplete.fuzzyFilter}
                        onNewRequest={this.viewActions.onSearch}/>
          <AvatarCardView models={models} fields={fields} actions={this.viewActions}/>
        </div>
        }

        { (mode == 'add' || mode == 'edit') &&
        <div>
          <h2>{`${mode == 'add' ? 'Add' : 'Edit'} User`}</h2>
          <CardEditView key={mode} model={editModel} fields={editFields} actions={this.viewActions} mode={mode}/>
        </div>
        }

        { dialog }
        { message }
        
        { items && (
          <div>
            <br/><br/><br/>
            <Bottom items={items} selectable={false}/>
          </div>
        )}
      </div>
    )
  }
}

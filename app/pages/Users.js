import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ViewActions from "../components/models/ViewActions";
import ModelActions from "../components/models/ModelActions";
import * as routeActions from "../components/route/routeActions";
import * as mapActions from "../components/map-leaflet/mapActions";
import Bottom from '../components/bottom/Bottom';
import AvatarCardView from '../components/view-card/AvatarCardView';
import CardEditView from '../components/view-card/CardEditView';
import {
  RaisedButton, FlatButton, AutoComplete, Snackbar, Dialog, FontIcon,
  Table, TableHeader, TableHeaderColumn, TableRow, Paper, EnhancedButton
} from "material-ui/lib";
import {
  SocialGroupAdd, ActionFavorite, ActionFavoriteBorder, MapsNearMe,
  ContentClear, ActionDone, ActionDelete, MapsPlace, EditorModeEdit
} from "material-ui/lib/svg-icons";

/**
 * card view with avatar, search bar, switch to edit view, add/edit/delete actions,
 *   bottom navigation bar, and show on map action
 */
@connect(state => ({
  users: state.users.list,
  currentUser: state.users.current
}), (dispatch, props) => bindActionCreators({...ModelActions('user'), ...mapActions, ...routeActions}, dispatch))
export default class Users extends Component {

  state = {} 

  componentWillMount() {
    this.viewActions = ViewActions('user', this);
    this.viewActions.onLoad();
  }

  render() {
    const {models, mode, selected, editModel, dialog, message} = this.state;
    const names = models ? Object.keys(models).map(key => models[key].name) : [];
    const fields = ['username', 'email', 'description'];
    const editFields = ['name', 'username', 'email', 'description', 'latitude', 'longitude'];
    const items = {
      Show: {Icon: MapsPlace, action: this.viewActions.onShow},
      Edit: {Icon: EditorModeEdit, action: this.viewActions.onEdit},
    }
    const editItems = {
      Delete: {Icon: ActionDelete, action: this.viewActions.onDelete},
      Cancel: {Icon: ContentClear, action: this.viewActions.onCancel},
      Save: {Icon: ContentClear, action: this.viewActions.onSave}
    }
    const bottomItems = mode == 'view' && {
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
          <AvatarCardView models={models} fields={fields} actions={this.viewActions} items={items}/>
        </div>
        }

        { (mode == 'add' || mode == 'edit') &&
        <div>
          <h2>{`${mode == 'add' ? 'Add' : 'Edit'} User`}</h2>
          <CardEditView key={mode} model={editModel} fields={editFields} actions={this.viewActions} mode={mode} 
                        items={editItems}/>
        </div>
        }

        { dialog }
        { message }
        
        { bottomItems && (
          <div>
            <br/><br/><br/>
            <Bottom items={bottomItems} selectable={false}/>
          </div>
        )}
      </div>
    )
  }
}

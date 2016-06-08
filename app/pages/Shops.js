import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import viewActions from "../components/models/viewActions";
import modelActions from "../components/models/modelActions";
import CardEditView from "../components/view-card/CardEditView";
import Map, * as Markers from '../components/map-leaflet/Map';
import TableView from '../components/view-table/TableView';
import SplitPane from 'react-split-pane';
import {
  RaisedButton, FlatButton, FontIcon, AutoComplete, Snackbar, Dialog, TextField, Toggle,
  Table, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableBody, TableFooter
} from "material-ui/lib";
import {
  ActionDelete, EditorModeEdit, MapsNearMe, ContentAdd
} from "material-ui/lib/svg-icons";

const styles = {
  root: {
    position: 'absolute',
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
    top: '70px',
    bottom: '0px',
    width: '100%'
  }
};

/**
 * split view of table and map, add/edit views, show popup on select
 */
@connect(state => ({
  currentUser: state.logged.currentUser
}))
export default class Shops extends Component {

  state = {
    fields: ['name', 'description'],
    editFields: ['name', 'description', 'latitude', 'longitude']
  }

  // todo bind on @connect, remove this constructor completely
  constructor(props) {
    super(props);
    this.modelActions = bindActionCreators({...modelActions('shop').actions}, props.dispatch);
    this.viewActions = viewActions('shop', this);
  }

  componentWillMount() {
    this.viewActions.onLoad();
  }

  render() {
    const {models, fields, editFields, mode, selected, editModel, dialog, message} = this.state;
    const currentUser = this.props.currentUser;

    let markers = [];
    if (models) markers = markers.concat(Markers.createMarkers(models, 'shop'));
    if (currentUser) markers.push(Markers.marker(currentUser, 'currentUser'));
    const popups = selected ? [Markers.createPopup(selected, <ShopPopup model={selected}/>)] : [];
    const center = selected ? {latitude: selected.latitude, longitude: selected.longitude} : null;

    const items = {
      Edit: {Icon: EditorModeEdit, action: this.viewActions.onEdit},
      Delete: {Icon: ActionDelete, action: this.viewActions.onDelete}
    }
    
    return (
      <div style={styles.root}>
        { mode == 'view' &&
        <SplitPane split="horizontal" minSize={50} defaultSize={250}>
          <TableView models={models} fields={fields} actions={this.viewActions}
                     selectable={false} enableSelectAll={false}
                     header={<Header models={models} actions={this.viewActions}/>} items={items}>
          </TableView>
          <Map markers={markers} center={center} zoom={selected ? 14 : 12} popups={popups}
               onClick={this.viewActions.onSelect}/>
        </SplitPane>
        }

        { (mode == 'add' || mode == 'edit') &&
        <div>
          <h2>{`${mode == 'add' ? 'Add' : 'Edit'} Shop`}</h2>
          <CardEditView model={editModel} fields={editFields} actions={this.viewActions}/>
        </div>
        }

        { dialog }
        { message }
      </div>
    )
  }
}

const Header = ({models, actions}) => {
  const modelsList = models ? Object.keys(models).map(key => models[key]) : [];
  const names = modelsList ? modelsList.map(model => model && model.name || '') : [];
  return (
    <div>
      <AutoComplete dataSource={names}
                    floatingLabelText="Search"
                    filter={AutoComplete.fuzzyFilter}
                    onNewRequest={actions.onSearch}/>
      <FlatButton label="Add" secondary={true} icon={<ContentAdd />} onTouchTap={actions.onAdd}/>
    </div>
  )
}

const ShopPopup = ({model}) => (
  <span>
    <h3>{model.name}</h3>
    <span>{model.description}</span>
  </span>
)
import React, {Component, PropTypes} from "react";
import {
  RaisedButton, FlatButton, AutoComplete, Snackbar, Dialog,
  Table, TableHeader, TableHeaderColumn, TableRow
} from "material-ui/lib";

import config from "../../config";

/**
 * helper for common view operations and local state management for a given model, such as
 *   models: onLoad, onSave, onDelete - handle load/save/delete, update state.models and show message/dialog as required
 *   mode: setMode, onAdd, onEdit, onCancel, onChange - simple view mode management (add/edit/add)
 *   message, dialog: showMessage, showDialog, ...
 */
export default (name, component) => {

  const props = component.props;
  const Name = name.charAt(0).toUpperCase() + name.slice(1);

  // modelActions are assumed to be mixed into the given component (using bindActionCreators or else)
  const modelActions = props;   

  // change component's state
  var state = Object.assign(component.state || {}, {
    mode: 'view',
    models: props.models,
    selected: null,
    editModel: {},
    message: '',
    dialog: '',
    current: props.current
  });

  // todo
  const setState = change => {
    component.setState(Object.assign(state, change));
  }

  return {
    state,
    onLoad, onSave, onDelete,
    setMode, onAdd, onEdit, onCancel, onChange,
    onShow, onSearch, onSelect, clearSelect,
    showDialog, clearDialog, showMessage, clearMessage
  }

  function onSave(e, model) {
    if (model && model.name) {
      modelActions.update(model).promise.then(res => res.json())
        .then(json => {
          const created = json.created;
          const update = created || model;
          modelActions.set([update]);
          if (created) {
            state.models.push(created);
          } else {
            state.models.splice(state.models.indexOf(model), 1, update);
          }
          console.log('state.models', state.models);
          setMode('view');
          showMessage(Name + (created ? ' created.' : ' updated.'));
        })
        .catch(error => {
          console.log('error', error);
          showMessage('Error saving model');
        });
    }
  }

  function onLoad(query = {limit: 10}) {
    modelActions.find(query).promise.then(response => response.json())
      .then(data => {
        console.log('find results', data);
        setState({models: data.result});
      })
      .catch(error => showMessage("Could not load."));
  }

  function onDelete(e, model) {
    showDialog("Are you Sure?",
      e => modelActions.deleteModel(model).promise.then(res => res.json())
        .then(response => {
          state.models.splice(state.models.indexOf(model), 1);
          clearDialog();
          setMode('view');
          clearSelect(e);
          showMessage(`${Name} deleted.`);
        }),
      e => clearDialog())
  }

  function setMode(mode) {
    setState({mode: mode})
  }

  function onAdd(e) {
    setMode('add');
    const currentUser = component.props.currentUser;
    console.log('currentUser', currentUser);
    const location = currentUser && currentUser.latitude && currentUser.longitude &&
      [currentUser.latitude, currentUser.longitude] || [];
    setState({editModel: Object.assign({}, location ? {latitude: location[0], longitude: location[1]} : {})});
  }
  
  function onEdit(e, model = Object.assign({}, props.current)) {
    setMode('edit');
    setState({editModel: model});
  }

  function onCancel(e, model) {
    setMode('view');
  }

  function onChange(e, change) {
    console.log('onChange', change);
    setState({editModel: Object.assign(state.editModel, change)});
  }

  function onShow(e, model) {
    if (model.latitude) {
      if (typeof props.setCenter === 'function') {
        props.setCenter({latitude: model.latitude, longitude: model.longitude});
      }
      if (typeof props.doRoute === 'function') {
        props.doRoute(config.app.routes.Map);
      }
    }
  }

  function onSearch(name) {
    const search = state.models.filter(model => model.name == name);
    if (search && search[0]) {
      onSelect(true, search[0]);
    }
  }

  function onSelect(e, model) {
    const selected = e && model;
    setState({selected: selected});
    setMode('view');
    console.log('selected', selected);
  }

  function clearSelect(e, model) {
    onSelect(e, null);
  }

  function showDialog(title, onConfirm, onCancel) {
    setState({dialog: <ConfirmDialog title={title} onConfirm={onConfirm} onCancel={onCancel}/>});
  }

  function clearDialog() {
    setState({dialog: ''});
  }

  function showMessage(message) {
    setState({message: <Message message={message} clearMessage={clearMessage}/>});
  }

  function clearMessage(e) {
    setState({message: ''});
  }
}

const ConfirmDialog = ({title, onConfirm, onCancel}) => (
  <Dialog title={title}
          actions={[
            <FlatButton label="Cancel" primary={true} onTouchTap={e => onCancel(e)}/>,
            <FlatButton label="Confirm" primary={true} onTouchTap={e => onConfirm(e)}/>
          ]}
          modal={false}
          open={true}
          onRequestClose={e => onCancel(e)}>
  </Dialog>
)

const Message = ({message, clearMessage}) => (
  <Snackbar message={message} open={true} autoHideDuration={3000} onRequestClose={clearMessage}/>
)
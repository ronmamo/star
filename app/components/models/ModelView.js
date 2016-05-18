import React, {Component, PropTypes} from "react";
import {bindActionCreators} from "redux";
import * as routeActions from "../route/routeActions";
import * as mapActions from "../map/mapActions";
import modelActions from "../models/modelActions";
import {
  Card, CardActions, CardHeader, CardText,
  TextField, RaisedButton, FlatButton, StarBorder,
  AutoComplete, Snackbar, Dialog,
  Table, TableHeader, TableHeaderColumn, TableRow,
  GridList, GridTile, Subheader
} from "material-ui/lib";
import {MapsPlace, EditorModeEdit, ContentClear, ActionDone, ActionDelete} from "material-ui/lib/svg-icons";
import config from "../../config";

const styles = {
  toolbar: {
    position: 'absolute', left: 0, right: 0, bottom: '0px'
  },
  right: {
    float: 'right'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 500,
    overflowY: 'auto',
    marginBottom: 24,
  }
}

const Mode = {view: {}, edit: {}, add: {}}

export default class ModelView extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    models: PropTypes.object.isRequired,
    current: PropTypes.object,
    options: PropTypes.object,
    actions: PropTypes.object,
    view: PropTypes.object,
    fields: PropTypes.array
  }

  constructor(props) {
    super(props);
    const name = this.props.name;
    this.Name = name.charAt(0).toUpperCase() + name.slice(1);
    this.actions = this.props.actions || bindActionCreators({...modelActions(this.Name).actions}, this.props.dispatch);
    this.Maps = bindActionCreators({...mapActions}, this.props.dispatch);
    this.Routes = bindActionCreators({...routeActions}, this.props.dispatch);
  }

  state = {
    mode: Mode.view,
    models: this.props.models,
    current: this.props.current,
    editModel: {},
    message: '',
    view: this.props.view || ModelCardView,
    dialog: ''
  }

  componentWillMount() {
    const query = {limit: 10};
    this.actions.find(query).promise.then(response => response.json())
      .then(data => {
        console.log('find results', data);
        this.actions.set(data.result);
        this.setState({dirty: true}); // todo hack - needed because changing state here does not result in render
      })
      .catch(error => this.showMessage("Could not load."));
  }

  onCardClick = (e, model) => {
    const toogle = this.state.current !== model ? model : null;
    this.actions.setCurrent(toogle);
  }

  onAdd = e => {
    this.setMode(Mode.add);
    this.setState({editModel: {}});
  }

  onEdit = (e, model = Object.assign({}, this.props.current)) => {
    this.setMode(Mode.edit);
    this.setState({editModel: model});
  }

  onCancel = (e, model) => {
    this.setMode(Mode.view);
  }

  onChange = (e, change) => {
    this.setState({editModel: Object.assign(this.state.editModel, change)});
  }

  onShow = (e, model) => {
    if (model.latitude) {
      this.Maps.setCenter({latitude: model.latitude, longitude: model.longitude});
      this.Routes.doRoute(config.app.routes.Map);
    }
  }

  onSave = (e, model) => {
    if (model && model.name) {
      this.actions.update(model).promise.then(res => res.json())
        .then(json => {
          const created = json.created;
          const update = created || model;
          this.actions.set([update]);
          this.setMode(Mode.view);
          this.showMessage(this.Name + (created ? ' created.' : ' updated.'));
        })
        .catch(error => {
          console.log('error', error);
          this.showMessage('Error saving model');
        });
    }
  }

  onDelete = (e, model) => {
    this.showDialog("Are you Sure?",
      e => this.actions.deleteModel(model).promise.then(res => res.json())
        .then(response => {
          this.clearDialog();
          this.showMessage(`${this.Name} deleted.`);
          this.setMode(Mode.view);
        }),
      e => this.clearDialog())
  }

  onSearch = e => {
    const models = Object.keys(this.state.models).map(key => this.state.model[key]);
    const match = models.filter(model => model.name == e);
    if (match && match[0]) {
      this.actions.setCurrent(match[0]);
      this.setState({current: match[0]}); // is needed?
      this.setMode(Mode.view);
      console.log('match[0]', match[0]);
    }
  }

  showDialog = (title, onConfirm, onCancel) => {
    this.setState({dialog: <ConfirmDialog title={title} onConfirm={onConfirm} onCancel={onCancel}/>});
  }

  clearDialog = () => {
    this.setState({dialog: ''});
  }

  showMessage = (message = '') => {
    this.setState({message: message});
  }

  clearMessage = e => {
    this.setState({message: ''});
  }

  setMode = mode => {
    this.setState({mode: mode})
  }

  onDialog = e => {
    console.log('onDialog e', e);
  }

  render() {
    const View = this.state.view;
    const models = this.state.models;
    const modelsList = models ? Object.keys(models).map(key => models[key]).filter(model => model) : [];
    const names = models ? modelsList.map(model => model && model.name || '') : [];
    const {mode, current, editModel, message, dialog} = this.state;
    const {fields} = this.props;

    return (
      <div>
        <div>
          <ModelViewBar searchList={names}
                        onSearch={this.onSearch}
                        onAdd={mode == Mode.view && this.onAdd}/>
        </div>

        { mode == Mode.add ?
          <ModelEdit model={editModel}
                     fields={fields}
                     onChange={this.onChange} onCancel={this.onCancel} onSave={this.onSave}
                     onDelete={this.onDelete}/>
          :
          modelsList.map(model =>
            mode == Mode.edit && editModel == model ?
              <ModelEdit model={editModel}
                         key={model.id}
                         fields={fields}
                         onChange={this.onChange} onCancel={this.onCancel} onSave={this.onSave}
                         onDelete={this.onDelete}/>
              :
              <View model={model}
                    key={model.id}
                    fields={fields}
                    expandMode={current !== model}
                    onCardClick={this.onCardClick}
                    onEdit={this.onEdit}
                    onShow={this.onShow}/>
          )}
        { dialog && dialog }
        { message &&
        <Snackbar message={message}
                  open={true}
                  autoHideDuration={4000}
                  onRequestClose={this.clearMessage}/>
        }
      </div>
    )
  }
}

export const ModelViewBar = ({searchList, onSearch, onAdd}) => (
  <Table>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn colSpan="2">
          { onSearch && searchList &&
          <AutoComplete floatingLabelText="Search"
                        dataSource={searchList}
                        filter={AutoComplete.fuzzyFilter}
                        onNewRequest={onSearch}/> }
        </TableHeaderColumn>
        <TableHeaderColumn colSpan="1">
          { onAdd && <RaisedButton label="Add" primary={true} onTouchTap={onAdd}/> }
        </TableHeaderColumn>
      </TableRow>
    </TableHeader>
  </Table>
)

export const ModelCardView = ({model, fields, expandMode = true, onCardClick, onShow, onEdit}) => (
  <Card key={model.id} expanded={expandMode} onExpandChange={e => onCardClick(e, model)}>
    <CardHeader title={model.name}
                subtitle={`Id: ${model.id}`}
                actAsExpander={true}
                showExpandableButton={true}>
    </CardHeader>
    { (fields || Object.keys(model).filter(key => key !== 'name' && key !== 'id'))
      .map(key => (
        <CardText key={key} expandable={true}>
          {key}: {model[key]}
        </CardText>
      ))
    }
    <CardActions style={styles.right} expandable={true}>
      { onShow && <RaisedButton label="Show" icon={<MapsPlace />} onTouchTap={e => onShow(e, model)}/> }
      { onEdit && <RaisedButton label="Edit" icon={<EditorModeEdit />} onTouchTap={e => onEdit(e, model)}/> }
    </CardActions>
  </Card>
)

const ModelTileView = ({model, fields, expandMode = true, onCardClick, onShow, onEdit}) => (
  <GridTile title={model.name}
            subtitle={model.id && `id: ${model.id}`}
            key={model.name}
            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}>
    <img src={model.img}/>
  </GridTile>
)

const ModelEdit = ({model, fields, expandMode = true, onChange, onCancel, onSave, onDelete}) => (
  <div>
    <Card>
      <CardHeader title={model.name}
                  subtitle={model.id && `id: ${model.id}`}>
        <br/>
        <TextField value={model.name}
                   hintText="Name"
                   floatingLabelText="Name"
                   errorText={!model.name ? "This field is required" : ""}
                   onChange={e => onChange(e, {name: e.target.value})}/>
        <br/>
      </CardHeader>
      <CardText>
        <br/>
        <br/>
        { (fields || Object.keys(model).filter(key => key !== 'name' && key !== 'id'))
          .filter(key => model[key] !== null)
          .map(key => (
            <span>
              <TextField value={model[key]}
                         hintText={key}
                         floatingLabelText={key}
                         errorText={!model[key] ? "This field is required" : ""}
                         onChange={e => {
                          let change = {};
                            change[key] = e.target.value;
                            onChange(e, change)
                         }}
              /><br/>
            </span>
          ))
        }
      </CardText>
      <CardActions style={styles.right}>
        { onDelete &&
        <RaisedButton label="Delete" icon={<ActionDelete />} onTouchTap={e => onDelete(e, model)}/> }
        { onCancel &&
        <RaisedButton label="Cancel" icon={<ContentClear />} onTouchTap={e => onCancel(e, model)}/> }
        { onSave &&
        <RaisedButton label="Save" primary={true} icon={<ActionDone />} onTouchTap={e => onSave(e, model)}/> }
      </CardActions>
    </Card>
  </div>
)

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


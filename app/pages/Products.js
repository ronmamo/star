import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ViewActions from "../components/models/ViewActions";
import ModelActions from "../components/models/ModelActions";
import PaperEditView from "../components/view-grid/PaperEditView";
import GridView from '../components/view-grid/GridView';
import GridSingleView from '../components/view-grid/GridSingleView';
import {MenuItem, DropDownMenu, Toolbar, ToolbarGroup, ToolbarTitle,} from "material-ui";
import {ActionViewModule, EditorModeEdit, ToggleStarBorder, ContentClear, ActionDelete} from "material-ui/svg-icons";

const styles = {
  toolbar: {
    margin: 10
  }
}

/**
 * tile view, search bar, switch to single view/edit, with image uploading
 */
@connect(state => ({
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators({...ModelActions('product')}, dispatch))
export default class Products extends Component {

  state = {}

  componentWillMount() {
    this.viewActions = new ViewActions('product', this);
    this.viewActions.onLoad();
  }

  onSearch = (e) => {
    console.log('handle change', e); // todo on search category changed
  }

  render() {
    const {models, mode, selected, editModel, dialog, message} = this.state;
    const fields = ['name', 'description'];
    const editFields = ['name', 'description', 'price', 'image'];

    const items = {
      Grid: {action: this.viewActions.clearSelect, Icon: ActionViewModule},
      Edit: {action: this.viewActions.onEdit, Icon: EditorModeEdit},
      Star: {Icon: ToggleStarBorder}
    }

    const editItems = {
      Delete: {Icon: ActionDelete, action: this.viewActions.onDelete},
      Cancel: {Icon: ContentClear, action: this.viewActions.onCancel},
      Save: {Icon: ContentClear, action: this.viewActions.onSave}
    }

    return (
      <div>
        { mode == 'view' && selected &&
        <GridSingleView model={selected} fields={fields} items={items}/>
        }

        { mode == 'view' && !selected &&
        <div>
          <SearchBar handleChange={this.onSearch}/>
          <GridView models={models} fields={fields} actions={this.viewActions}/>
        </div>
        }

        { (mode == 'add' || mode == 'edit') &&
        <div>
          <h2>{`${mode == 'add' ? 'Add' : 'Edit'} Product`}</h2>
          <PaperEditView model={editModel} fields={editFields} actions={this.viewActions} items={editItems}/>
        </div>
        }

        { dialog }
        { message }
      </div>
    )
  }
}

const SearchBar = ({handleChange}) => (
  <Toolbar style={styles.toolbar}>
    <ToolbarGroup>
      <ToolbarTitle text="Products"/>
    </ToolbarGroup>
    <ToolbarGroup>
      <DropDownMenu value={1} onChange={handleChange}>
        <MenuItem value={1} primaryText="All Products"/>
        <MenuItem value={2} primaryText="Nearby"/>
        <MenuItem value={3} primaryText="Favorites"/>
      </DropDownMenu>
    </ToolbarGroup>
  </Toolbar>
)
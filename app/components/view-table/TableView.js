import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui';
import EnhancedButton from 'material-ui/internal/EnhancedButton'
const styles = {
  icon: {
    marginTop: '10px'
  }
}

/**
 *
 */
export default class TableView extends Component {

  static propTypes = {
    models: PropTypes.array.isRequired,
    fields: PropTypes.array,
    actions: PropTypes.object,
    header: PropTypes.object,
    footer: PropTypes.object,
    items: PropTypes.object,
    onTouchTap: PropTypes.func
  }

  state = {
    selected: []
  }

  onSelect = (selected) => {
    this.setState({selected: selected});
    if (this.props.actions.onSelect) {
      const model = this.props.models[selected];
      this.props.actions.onSelect(selected, model);
    }
  }

  render() {
    const {models, fields, items, footer}  = this.props;
    const {selected} = this.state;

    return (
      <Table selectable={this.props.selectable || true}
             multiSelectable={this.props.multiSelectable || false}
             onRowSelection={this.onSelect}>
        <TableHeader displaySelectAll={this.props.displaySelectAll || false}
                     adjustForCheckbox={false}
                     enableSelectAll={this.props.enableSelectAll || false}>
          { this.props.header &&
          <TableRow>
            <TableHeaderColumn colSpan={fields.length + (items ? 1 : 0)}>
              {this.props.header}
            </TableHeaderColumn>
          </TableRow>
          }
          <TableRow>
            { fields.map(key => <TableHeaderColumn tooltip={key}>{key}</TableHeaderColumn>) }
            { items && <TableHeaderColumn tooltip={'Actions'}>Actions</TableHeaderColumn> }
          </TableRow>
        </TableHeader>
        )}

        <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={false}>
          {models && models.map((model, index) => (
            <TableRow key={index} selected={selected.indexOf(index) !== -1}>
              { fields.map(key => <TableRowColumn key={'col' + index}>{model[key]}</TableRowColumn>) }
              { this.props.children || '' }
              { Object.keys(items).map((key, index) => {
                const Icon = items[key].Icon;
                const action = items[key].action;
                return <ActionButton Icon={Icon} action={e => action(e, model)}
                                     selected={selected.indexOf(index) !== -1}/>;
              })}
            </TableRow>
          ))}
        </TableBody>

        { footer && (
          <TableFooter>
            <TableRow>
              { fields.map(key => <TableHeaderColumn tooltip={key}>{key}</TableHeaderColumn>) }
            </TableRow>
            <TableRow>
              <TableRowColumn colSpan={fields.length} style={{textAlign: 'center'}}>
                {footer}
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    );
  }
}

const ActionButton = ({Icon, selected, action}) => {
  return (
    <EnhancedButton key={'' + action}
                    style={Object.assign({}, styles.button)}
                    selected={selected}
                    onTouchTap={e => action(e)}>
      <Icon style={Object.assign({}, styles.icon)}/>
    </EnhancedButton>
  )
}
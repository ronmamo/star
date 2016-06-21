import {Actions} from './AvatarCardView'
import {
  Card, CardActions, CardHeader, CardText, TextField, RaisedButton
} from "material-ui/lib";
import {ContentClear, ActionDone, ActionDelete} from "material-ui/lib/svg-icons";

/**
 * card add/edit view with text field per field, with delete/cancel/save actions
 */
export const CardEditView = ({model, fields, actions, mode, items}) => (
  <Card>
    { mode === 'edit' ?
      <CardHeader title={model.name} subtitle={model.description}/> : <div></div> }

    <CardText>
      {(fields || Object.keys(model).filter(key => key !== 'name' && key !== 'id' && model[key] !== null))
        .map(key => (
          <div>
            <TextField value={model[key]} hintText={key} floatingLabelText={key}
                       errorText={!model[key] ? "This field is required" : ""}
                       onChange={e => actions.onChange(e, diff(e, key))}/>
            <br/>
          </div>
        ))
      }
    </CardText>

    <Actions model={model} items={items}/>
  </Card>
)

const diff = (e, key) => {
  let change = {};
  change[key] = e.target.value;
  return change;
}

export default CardEditView

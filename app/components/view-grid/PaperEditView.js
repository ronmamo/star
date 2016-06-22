import {Paper, Divider, TextField, RaisedButton,} from "material-ui";
import Dropzone from 'react-dropzone';

const styles = {
  right: {
    float: 'right'
  },
  paperList: {
    marginLeft: 20
  },
  preview: {
    float: 'right',
    width: 200,
    height: 200
  }
}

/**
 * paper edit view with text field per field, delete/cancel/save action buttons, image select/drag and drop
 */
export const PaperEditView = ({model, fields, actions, items}) => {
  return (
    <Paper>
      { (fields || Object.keys(model).filter(key => key !== 'name' && key !== 'id'))
        .map(key =>
          <span>
            {key === 'image' ?
              <Dropzone onDrop={files => actions.onChange(files, {image: files[0].preview})} multiple={false}>
                { model.image ? <img src={model.image} style={styles.preview}/>
                  : <div>Try dropping some files here, or click to select files to upload.</div> }
              </Dropzone>

              : <TextField key={key} hintText={key} style={styles.paperList} underlineShow={false}
                           value={model[key]} onChange={e => actions.onChange(e, diff(e, key))}/>
            }
            <Divider />
          </span>
        )
      }

      { items && (
        <div style={styles.right}>
          { Object.keys(items).map(key => {
              const Icon = items[key].Icon;
              return <RaisedButton label={key} icon={<Icon/>} onTouchTap={e => items[key].action(e, model)}/>;
            }
          )}
        </div>
      )}
    </Paper>
  )
}

const diff = (e, key) => {
  let change = {};
  change[key] = e.target.value;
  return change;
}

export default PaperEditView

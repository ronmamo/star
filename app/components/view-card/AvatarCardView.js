import {Card, CardActions, CardHeader, CardText, Avatar, RaisedButton} from "material-ui/lib";
import {MapsPlace, EditorModeEdit} from "material-ui/lib/svg-icons";
import gravatar from 'gravatar';

const styles = {
  right: {
    float: 'right'
  }
}

/**
 * avatar card view of users, with show in map/edit actions
 */
export const AvatarCardView = ({models, fields, actions}) => {
  const modelsList = models ? Object.keys(models).map(key => models[key]) : [];
  return (
    <div>
      {modelsList.map(model => (
        <Card key={model.id} expanded={true} onExpandChange={e => actions.onSelect(e, model)}>
          <CardHeader title={model.name}
                      subtitle={model.email}
                      actAsExpander={true}
                      showExpandableButton={true}
                      avatar={ <Avatar src={model.email && gravatar.url(model.email)}/> }>
          </CardHeader>
          { (fields || Object.keys(model).filter(key => key !== 'name' && key !== 'id'))
            .map(key => (
              <CardText key={key} expandable={true}>
                {key}: {model[key]}
              </CardText>
            ))
          }
          <CardActions style={styles.right} expandable={true}>
            <RaisedButton label="Show" icon={<MapsPlace />} disabled={!model.latitude}
                          onTouchTap={e => actions.onShow(e, model)}/>
            <RaisedButton label="Edit" icon={<EditorModeEdit />} onTouchTap={e => actions.onEdit(e, model)}/>
          </CardActions>
        </Card>
      ))}
    </div>
  )
}

export default AvatarCardView

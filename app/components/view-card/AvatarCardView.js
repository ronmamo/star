import {Card, CardActions, CardHeader, CardText, Avatar, RaisedButton} from "material-ui";
import gravatar from 'gravatar';

const styles = {
  right: {
    float: 'right'
  }
}

/**
 * avatar card view of users, with show in map/edit actions
 */
export const AvatarCardView = ({models, fields, actions, items}) => {
  const modelsList = models ? Object.keys(models).map(key => models[key]) : [];
  return (
    <div>
      {modelsList.map(model => (
        <Card key={model.id} onExpandChange={e => actions.onSelect(e, model)}>
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
          <CardText key="actions" expandable={true}>
            <Actions model={model} items={items}/>
            <br/><br/><br/>
          </CardText>
        </Card>
      ))}
    </div>
  )
}

export const Actions = ({model, items}) => (
  <CardActions style={styles.right}>
    { Object.keys(items).map(key => {
      const Icon = items[key].Icon;
      return <RaisedButton key={key} label={key} icon={<Icon />} onTouchTap={e => items[key].action(e, model)}/>
    })}
  </CardActions>
)

export default AvatarCardView

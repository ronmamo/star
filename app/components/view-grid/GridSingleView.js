import {IconButton, GridList, GridTile} from "material-ui/lib";
import {ToggleStarBorder, ContentAdd, EditorModeEdit, ActionViewModule} from "material-ui/lib/svg-icons";

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 300,
    overflowY: 'auto',
    marginBottom: 24
  },
  single: {
    width: '100%',
    height: '85%',
    overflowY: 'auto',
    marginTop: 10,
    marginBottom: 10
  },
  cellHeight: 150,
  cols: 3
}

/**
 * grid with single tile view
 */
export const GridSingleView = ({model, fields, items}) => {
  return (
    <div style={styles.root}>
      <GridList cellHeight='100%' cols={1} style={styles.single} subtitle="Subtitle">
        <GridTile key={model.name}
                  title={model.name}
                  subtitle={<span><b>{model.description}</b></span>}
                  actionIcon={
                  <div>
                    { Object.keys(items).map(key => {
                      const Icon = items[key].Icon;
                      return <IconButton onTouchTap={e => items[key].action(e, model)}><Icon color="white" /></IconButton>;
                    })}
                  </div>
                  }>
          {console.log('model.image', model.image)}
          <img src={model.image}/>
        </GridTile>
      </GridList>
    </div>
  )
}

export default GridSingleView

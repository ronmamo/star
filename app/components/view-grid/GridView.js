import {IconButton, GridList, GridTile} from "material-ui";
import {ToggleStarBorder, ContentAdd} from "material-ui/svg-icons";

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
 * grid view with image, select on click
 */
export const GridView = ({models, fields, actions}) => {
  const modelsList = models ? Object.keys(models).map(key => models[key]) : [];
  return (
    <div style={styles.root}>
      <GridList cellHeight={styles.cellHeight} cols={styles.cols} style={styles.gridList} subtitle="December">
        {modelsList.map(model =>
          <GridTile key={model.id}
                    title={model.name}
                    subtitle={<span><b>{model.description || 'description'}</b></span>}
                    onTouchTap={e => actions.onSelect(e, model)}
                    actionIcon={<IconButton><ToggleStarBorder color="white" /></IconButton>}>
            <img src={model.image}/>
          </GridTile>)
        }
        <GridTile key={"add"}
                  title={"Add"}
                  onTouchTap={e => actions.onAdd(e)}
                  actionIcon={<IconButton><ContentAdd color="white" /></IconButton>}>
        <img src={''}/>
        </GridTile>
      </GridList>
    </div>
  )
}

export default GridView

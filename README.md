
# Star
### Yet another React starter kit

**Playing around with es6 and [React](https://facebook.github.io/react/)/[React-Native](https://facebook.github.io/react-native/). Based on [pdxlivebus](https://github.com/browniefed/pdxlivebus) and other starter kits.**

----

### Idea

The idea is to have an initial set of **high order components** 
for easily compose **your own flavoured MVP** in no time. 

The components can be added as a one line html tag, and are encapsulating view and state manipulation using Redux.

For example, in order to have geo location support, just add `<GeoLocation/>` tag.
Then, location will be watched and the global state `state.geo.location` will be updated accordingly.
In any component where the location is needed, just connect it to Redux and get the value injected:
```
@connect(state => ({
  location: state.geo.location
}))
class SomeComponent extends Component {
  render() {
    ...
    <GeoLocation/>
    <div>Location: {this.props.location}</div>
    ...
  }
}
```

### High Order Components

Some of the components included in the `components` folder:
- `LoggedIn` - google login 
- `Map` - leaflet map view
- `Header`, `Bottom` - Material-UI app bar and bottom navigation
- `CurrentUser` - persist current user changes including profile and geo location
- `Route` - a very simple routing

For model view and edit, some Material-UI components are provided for card/grid/table views, such as:
- `AvatarCardView`
- `TableView`
- `GridView`
- `EditCardView`
- `PaperEditView`

For model operations, `ModelActions` can be used for executing 
async rest crud operations against the server via `sequelizeRouter` 

`ViewActions` is an optional simple helper, encapsulating common model view behaviours, 
such as local models management, mode changes, show dialog and message.

Example of a model component:
```
@connect(state => ({
  currentUser: state.logged.currentUser
}), (dispatch, props) => bindActionCreators({...ModelActions('user')}, dispatch))
class MyModel extends Component {

  state = {}
  
  componentWillMount() {
    this.viewActions = ViewActions('user', this);
    this.viewActions.onLoad(); // on load query and set state
  }
  
  render() {
    const {users, editModel, mode} = this.state; // injected by viewActions
    const fields = ['username', 'email', 'location']
    ...
    { mode == 'view' && <AvatarCardView models={users} fields={fields} actions={this.viewActions}/> }
    { (mode == 'add' || mode == 'edit') && <CardEditView model={editModel} fields={field} actions={this.viewActions}/> }
    ...
  }
  ...
```

### Server side 
`web-server/server.js` is an Express application, with Webpack hot reload and Sequelize support.

`SequelizeRouter` will be used for adding rest router for each Sequelize model definition, exposing: 
 - `GET /v1/model?query` - find
 - `GET /v1/model/:id`
 - `POST /v1/model {entity}` - upsert 
 - `DELETE /v1/model/:id`
 
On the client side, `ModelActions` is used for sending requests to `SequelizeRouter`.

### Example
So when the Main component looks like:

```
...
import config from './config';
const routes = config.app.routes;

export default class Main extends Component {

  render() {
    return (
      <div>
        <Header title={app.name} routes={routes}/>

        <LoggedIn googleAppId={...} guest={true} route={routes.Map}>

          <GeoLocation/>
          <CurrentUser/>

          <Route on={routes.Map}>
            <VehicleSocket/>
            <Map/>
          </Route>

          <Route on={routes.Users}>
            <Users/>
          </Route>

          <Route on={routes.Vehicles}>
            <VehicleSocket/>
            <Vehicles/>
          </Route>

          <Route on={routes.Products}>
            <Products/>
          </Route>

          <Route on={routes.Shops}>
            <Shops/> 
          </Route>

        </LoggedIn>
      </div>
    )
  }
}
```

The result is:

![output](https://cloud.githubusercontent.com/assets/2588829/15898744/123aae8e-2da2-11e6-8b0e-b2af6f9397e7.gif)

### How to run
`clone `
- Look at web-server/config.js and app/config.js
- Install PostgreSQL, CREATE DATABASE stardb
- Configure app/config.js with google app clientId (using console.developers.google.com)
- npm install
- npm run dev

### Techs

#### Front
- React, React native
- [Redux](https://github.com/reactjs/redux)
- Webapck w/ hot reload
- [Material-UI](http://www.material-ui.com) 
- Google login (used in LoggedIn component)
- [Leaflet](http://leafletjs.com/) OpenStreetMap
- Helmet
- [orchestrate.io](http://orchestrate.io) - the-very-cool orchestrate db as a service (optional)
- socket.io client - for streaming (used in VehicleSocket

#### Server
- Express
- Webpack
- Sequelize
- Postgresql

#### Laters
- **Have an initial set of components for easily building your own flavoured MVP**
- PostGis support including geo queries
- Paypal integration
- Redis and/or Graphql support
- Image uploading
- Make it work for android and ios...
- Maybe use Springboot instead/supplement of nodejs web/api server

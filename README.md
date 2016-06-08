# Star
### Yet another React starter kit

**Playing around with es6 and [React](https://facebook.github.io/react/)/[React-Native](https://facebook.github.io/react-native/). Based on [pdxlivebus](https://github.com/browniefed/pdxlivebus) and other starter kits.**

----

### Idea

The idea is to have and initial set of **high order components** 
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

Another component, `<LoggedIn/>` will take care of google login, updating current user state `state.logged.currentUser`:
```
@connect(state => ({
  currentUser: state.logged.currentUser
}))
class SomeComponent extends Component {
  render() {
    ...
    <LoggedIn googleAppId={...}>
        <div>CurrentUser: {this.props.currentUser}</div>
    </LoggedIn>
    ...
  }
}
```

### High Order Components

The `component` folder contains some high order components.

For model view and edit, some material-ui components are provided for card/grid/table views, 
such as `AvatarCardView`, `TableView`, `GridView`, `CardEditView`, `PaperEditView`.

For model operations, `modelActions` can be used for executing async rest operations against the server via `sequelizeRouter`, 
such as get/find/add/update/delete. 

`viewActions` is an optional simple helper, encapsulating common model view behaviours, 
such as local models management, mode changes, show dialog and message.

Other components included:
- `Map` - leaflet map view
- `Header`, `Bottom` - material-ui app bar and bottom navigation
- `CurrentUser` - persist current user changes including profile and geo location
- `Route` - a very simple routing

```
@connect(state => ({
  currentUser: state.logged.currentUser
})) 
class MyModel extends Component {

  state = {}
  
  constructor(props) {
    super(props);
    this.modelActions = bindActionCreators({...modelActions('user').actions}, props.dispatch);
    this.viewActions = viewActions('user', this);
  }

  componentWillMount() {
    this.viewActions.onLoad(); // on load query and set state
  }
  
  render() {
    const {users, selected} = this.state; // injected by viewActions
    const fields = ['username', 'email', 'location']
    ...
    <AvatarCardView models={users} fields={fields} actions={this.viewActions}/>
    <CardEditView model={selected} fields={field} actions={this.viewActions}/>
    ...
  }
  
  onSelect = (e, model) => { this.setState({selected: model}) }
  onSave = (e, model) => { this.props.Users.update(model) ... }
  ...
```

### Server side 
`web-server/server.js` contains an express application, with sequelize support.

Just add a model definition to `web-server/models`, 
and `SequelizeRouter` will be used for adding rest router for each sequelize model definition, exposing: 
 - `GET /v1/model?query` - find
 - `GET /v1/model/:id`
 - `POST /v1/model {entity}` - upsert 
 - `DELETE /v1/model/:id`
 
On the client side, `ModelActions` is used for sending requests to `SequelizeRouter`.

```
  sequelize.define('user', {...})
  ...
  sequelizeRouter(router, sequelize.models)
```

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

        <LoggedIn route={routes.Map}>

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

![output](https://cloud.githubusercontent.com/assets/2588829/14881376/5d528080-0d3c-11e6-84da-4761912ca004.gif)

### How to run
- Look at web-server/config.js and app/config.js
- Install Postgresql, CREATE DATABASE stardb
- Add googleAppId to the app/config.js
- npm install
- npm run dev
- (Optionally) if using orchestrate.io and usersRouter, add orchestrateToken to the web-server/config.js

### Techs

#### Front
- React, React native
- [Redux](https://github.com/reactjs/redux)
- Webapck w/ hot reload
- [material-ui](material-ui.com) ootb (used in Header component)
- Google login (used in LoggedIn component)
- [Leaflet](http://leafletjs.com/) OpenStreetMap
- Helmet
- [orchestrate.io](orchestrate.io) - the-very-cool orchestrate db as a service (used in UsersDb component)
- socket.io client - for streaming (used in VehicleSocket

#### Server
- Express
- Sequelize


#### Laters
- **Have an initial set of components for easily building your own flavoured MVP**
- PostGis support including geo queries
- Paypal integration
- Redis and/or Graphql support
- Image uploading
- Make it work for android and ios...
- Maybe use Springboot instead/supplement of nodejs web/api server

# Star
### Yet another React starter kit

**Playing around with es6 and [React](https://facebook.github.io/react/)/[React-Native](https://facebook.github.io/react-native/). Based on [pdxlivebus](https://github.com/browniefed/pdxlivebus) and other starter kits.**

----

#### Idea

The idea is to have high order components, that can be added as a **one line html tag**, 
encapsulating view and global state manipulation using Redux.

For example, in order to have geo location support, just add `<GeoLocation/>` tag.

Then, geo location will be watched and the global state will be updated accordingly.

In any other component where the location is needed, just connect it to Redux and get the value injected:

`
@connect(state => ({
  location: state.geo.location,
  ...
}))
`

In the same manner, another component, `<LoggedIn/>` will take care of google login, updating current user in redux store.

Other elements are `<ModelView/>` in conjuction with `modelActions('entity')` and `sequelizeRouter` that auto create full crud for sequelize defined model, exposes REST via express, and configurable view with support for read/add/edit/delete (see [Users](https://github.com/ronmamo/star/blob/master/app/components/users/Users.js), [Shops](https://github.com/ronmamo/star/blob/master/app/components/shops/Shops.js))

#### Components
So when the Main component looks like:

```
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
            <MapWrap/>
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

![untitled](https://cloud.githubusercontent.com/assets/2588829/15377894/bae47fec-1d67-11e6-8cb4-9b8eef0cff25.gif)

#### How to run
- edit the server config.js - change the sequelize db settings
- edit the client config.js - add googleAppId
- npm install
- npm run dev

#### Techs

- [React](https://facebook.github.io/react/)/[React-Native](https://facebook.github.io/react-native/)
- [Redux](https://github.com/reactjs/redux)
- [Webapck](https://webpack.github.io/) w/ hot reload
- [Express](http://expressjs.com/)
- [Sequelize](http://docs.sequelizejs.com/)
- Google login (used in LoggedIn component)
- [Leaflet](http://leafletjs.com/) OpenStreetMap
- [material-ui](material-ui.com) ootb (used in Header component)
- [orchestrate.io](orchestrate.io) - (optional) the-very-cool orchestrate db as a service
- socket.io client - for streaming (used in VehicleSocket)


#### Laters
- **Have an initial set of components for easily building your own flavoured MVP**
- PostGis support including geo queries
- Paypal integration
- Redis and/or Graphql support
- Image uploading
- Make it work for android and ios...
- Maybe use Springboot instead/supplement of nodejs web/api server

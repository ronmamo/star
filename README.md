# Star
### Yet another React starter kit

**Playing around with es6 and [React](https://facebook.github.io/react/)/[React-Native](https://facebook.github.io/react-native/). Based on [pdxlivebus](https://github.com/browniefed/pdxlivebus) and other starter kits.**

----

#### Idea

The idea is to have high order components, that can be added as a one line html tag,
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

#### Components
So when the Main component looks like:

```
export default class Main extends Component {

  render() {
    return (
      <div>
        <Header title={config.app.title}/>
        <LoggedIn>

          <GeoLocation/>
          <UsersDb/>

          <Route on='Map'>
            <VehicleSocket/>
            <Map/>
          </Route>

          <Route on='Users'>
            <Users/>
          </Route>

        </LoggedIn>
      </div>
    )
  }
}
```

The results is:

![image](https://cloud.githubusercontent.com/assets/2588829/14859734/2f30efcc-0cae-11e6-916f-c686c36d26ec.png | width=200)

![image](https://cloud.githubusercontent.com/assets/2588829/14859802/77da7ae0-0cae-11e6-8e08-8d094d97555b.png | width=200)

![image](https://cloud.githubusercontent.com/assets/2588829/14859749/4049196a-0cae-11e6-948a-62a2c09f9650.png | width=200)

#### How to run
- Add googleAppId and orchestrateToken to the config.js file
- npm install
- npm run dev

#### Techs

- [Redux](https://github.com/reactjs/redux)
- Webapck w/ hot reload
- Google login (used in LoggedIn component)
- [Leaflet](http://leafletjs.com/) OpenStreetMap
- [material-ui](material-ui.com) ootb (used in Header component)
- [orchestrate.io](orchestrate.io) - the-very-cool orchestrate db as a service (used in UsersDb component)
- socket.io client - for streaming (used in VehicleSocket)


#### Laters
- Make it work for android and ios...
- Use Springboot instead/supplement of nodejs web/api server
- **Have an initial set of components for easily building your own flavoured MVP**
- Redis and/or Graphql support
- Paypal integration

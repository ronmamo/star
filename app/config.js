const config = {
  app: {
    name: 'Star',
    
    // simple routes
    routes: {
      Map: {}, 
      Users: {}, 
      Vehicles: {}, 
      Products: {},
      Shops: {}
    },

    // google app clientId used for logging.
    // how to get: enter //console.developers.google.com and create new project,
    // create oauth2 credentials, set origin/redirect uri to http://localhost:3000 (for dev)
    googleAppId: '609013668819-k889t4uc0nvmd9hmbjiv65vvvlo6so7e.apps.googleusercontent.com'
    
  }
}

export default config;
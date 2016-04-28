const config = {
  app: {
    title: 'Star',

    // google app clientId used for logging.
    // how to get: enter //console.developers.google.com and create new project,
    // create oauth2 credentials, set origin/redirect uri to http://localhost:3000 (for dev)
    googleAppId: '',

    routes: [
      'Map', 'Users', 'Logout'
    ]
  },

  db: {
    // orchestrate db token
    // how to get: //orchestrate.io
    orchestrateToken: '',
  }
}

export default config;
import appConfig from '../app/config';

const webserverConfig = {
  webserver: {
    
    // optional orchestrate db token
    // how to get: //orchestrate.io
    orchestrateToken: '',
    
    // optional sequelize
    // install: brew install postgresql; brew services start postgresql; 
    //          CREATE DATABASE stardb;
    //          optionally CREATE EXTENSION postgis;
    sequelize: {
      database: 'stardb',
      username: 'ron',
      password: '',
      options: {
        dialect: "postgres", // 'mysql', 'sqlite', 'postgres', 'mariadb'
        port: 5432, // 3306 (for mysql), or 5432 (for postgres)
      }
    }
  }
}

const config = Object.assign({}, appConfig, webserverConfig)
export default config;
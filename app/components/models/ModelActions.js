import fetch from 'isomorphic-fetch';
import chalk from 'chalk';

/**
 * model crud actions and reducer for a given model name, 
 *  for managing model in db via sequelizeRouter and global state management
 */
export default (name) => {

  const API_PREFIX = `/api/${name}`;
  const REDUX_POSTFIX = '_' + name.toUpperCase();

  const GET = 'GET' + REDUX_POSTFIX;
  const FIND = 'FIND' + REDUX_POSTFIX;
  const UPDATE = 'UPDATE' + REDUX_POSTFIX;
  const DELETE = 'DELETE' + REDUX_POSTFIX;
  const SET = 'SET' + REDUX_POSTFIX;
  const SET_CURRENT = 'SET_CURRENT' + REDUX_POSTFIX;
  
  const actions = {
    get, find, update, deleteModel, set, setCurrent
  }
  
  return actions;

  function get(id) {
    return {
      type: GET,
      promise: fetch(`${API_PREFIX}/${id}`)
    }
  }

  function find(query) {
    console.log(chalk.blue(`find ${name}`), query);
    const json = JSON.stringify(query);
    return {
      type: FIND,
      promise: fetch(`${API_PREFIX}?query=${json}`)
    }
  }

  function update(model) {
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify(model);
    return {
      type: UPDATE,
      model,
      promise: fetch(API_PREFIX, {method: 'POST', headers: headers, body})
    }
  }

  function deleteModel(model) {
    return {
      type: DELETE,
      model,
      promise: fetch(`${API_PREFIX}/${model.id}`, {method: 'DELETE', headers: {'Content-Type': 'application/json'}})
    }
  }

  function set(models) {
    return {
      type: SET,
      models
    }
  }

  function setCurrent(model) {
    return {
      type: SET_CURRENT,
      model
    }
  }
}

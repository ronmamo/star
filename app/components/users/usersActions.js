import fetch from 'isomorphic-fetch';
import chalk from 'chalk';

const COLLECTION = 'users';
const API_PREFIX = `/api/${COLLECTION}`;

const GET_USER = 'GET_USER';
const FIND_USERS = 'FIND_USERS';
const UPDATE_USERS = 'UPDATE_USERS';
const SET_USERS = 'SET_USERS';

const initialState = {
  users: {}
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
    case FIND_USERS:
      return state;
    case UPDATE_USERS:
    case SET_USERS:
      const map1 = action.users.reduce((map, user) => {
        map[user.username] = user;
        return map;
      }, {});
      console.log("set users", map1);
      return {
        ...state,
        users: Object.assign(state.users, map1)
      }
    default:
      return state;
  }
}

export function getUser(username) {
  return {
    type: GET_USER,
    promise: fetch(`${API_PREFIX}/${username}`)
  }
}

export function findUsers(query) {
  const body = JSON.stringify(query);
  return {
    type: FIND_USERS,
    promise: fetch(`${API_PREFIX}?query=${body}`)
  }
}

export function updateUsers(users) {
  const body = JSON.stringify({ users });
  console.log(chalk.blue("update users"), body);
  return {
    type: UPDATE_USERS,
    users,
    promise: fetch(API_PREFIX, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
  }
}

export function setUsers(users) {
  return {
    type: SET_USERS,
    users
  }
}

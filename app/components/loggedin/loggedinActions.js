export const LOGGED_IN = 'LOGGED_IN';
export const LOG_OUT = 'LOG_OUT';
export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

const initialState = {
  token: null,
  currentUser: null
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        token: action.token,
        currentUser: action.currentUser
      }
    case UPDATE_CURRENT_USER:
      const assigned = Object.assign({}, state.currentUser, action.currentUser);
      return {
        ...state,
        currentUser: assigned
      }
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
}

export const getAuthInstance = () => {
  return window.gapi ? window.gapi.auth2.getAuthInstance() : null;
}

export function loggedIn(token, currentUser) {
  return {
    type: LOGGED_IN,
    token,
    currentUser
  }
}

export function logout() {
  return {
    type: LOG_OUT,
    promise: getAuthInstance().signOut()
  }
}

export function updateCurrentUser(currentUser) {
  return {
    type: UPDATE_CURRENT_USER,
    currentUser
  }
}

export function isLoggedIn() {
  const authInstance = getAuthInstance();
  return authInstance && authInstance.isSignedIn.get();
}

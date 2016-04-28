

const UPDATE_LOCATION = 'UPDATE_LOCATION';

const initialState = {
  location: {}
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOCATION: {
      return {
        ...state,
        location: action.location
      }
    }
    default:
      return state;
  }
};

export function updateLocation(location) {
 return {
  type: UPDATE_LOCATION,
  location
  }
}

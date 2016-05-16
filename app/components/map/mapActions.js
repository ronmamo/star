

const SET_CENTER = 'SET_CENTER';

const initialState = {
  center: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CENTER:
      return {
        ...state,
        center: action.center
      }
    default:
      return state;
  }
}

export function setCenter(center) {
  console.log('setCenter', center);
  return {
    type: SET_CENTER,
    center
  }
}

import config from '../../../config';

export const ROUTE = 'ROUTE';

const initialState = {
  route: config.app.routes[0]
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case ROUTE: {
      return {
        ...state,
        route: action.route
      }
    }
    default:
      return state;
  }
}

export function doRoute(route) {
  return {
    type: ROUTE,
    route
  }
}

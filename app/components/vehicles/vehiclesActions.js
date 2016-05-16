

export const UPDATE_VEHICLES = 'UPDATE_VEHICLES';

const initialState = [];

export function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_VEHICLES:
      return action.vehicles;
    default:
    return state;
  }
}

export function updateVehicles(vehicles) {
//  console.log("update vehicles", { vehicles });
  return {
   type: UPDATE_VEHICLES,
    vehicles
  }
}

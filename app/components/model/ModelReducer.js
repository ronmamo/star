/**
 * model crud actions and reducer for a given model name, 
 *  for managing model in db via sequelizeRouter and global state management
 */
export default (name) => {

  const LIST = 'list';
  const CURRENT = 'current';

  const REDUX_POSTFIX = '_' + name.toUpperCase();

  const GET = 'GET' + REDUX_POSTFIX;
  const FIND = 'FIND' + REDUX_POSTFIX;
  const UPDATE = 'UPDATE' + REDUX_POSTFIX;
  const DELETE = 'DELETE' + REDUX_POSTFIX;
  const SET = 'SET' + REDUX_POSTFIX;
  const SET_CURRENT = 'SET_CURRENT' + REDUX_POSTFIX;

  const initialState = () => {
    const initial = {};
    initial[LIST] = {};
    initial[CURRENT] = null;
    return initial;
  };
  
  const reducer = (state = initialState(), action) => {
    const model = action.model;
    const stateModels = state[LIST];
    const actionModels = action.models;
    const actionCurrentModel = action.currentModel;
    switch (action.type) {
      case GET:
      case FIND:
        return state;
      case UPDATE:
        if (model.id) {
          console.log(`update ${name}`, model);
          const assigned = assign(stateModels, [model]);
          return {
            ...state,
            list: assigned
          }
        } else {
          return state;
        }
      case DELETE:
        console.log(`delete ${name}`, model);
        delete stateModels[model.id];
        return {
          ...state,
          list: stateModels
        }
      case SET:
        console.log(`set ${name}`, actionModels);
        const assigned = actionModels ? assign(stateModels, actionModels) : [];
        return {
          ...state,
          list: assigned
        }
      case SET_CURRENT:
        let change = {};
        change[CURRENT] = actionCurrentModel;
        return Object.assign(state, change);
      default:
        return state;
    }
  }

  return reducer;
}

const assign = (map, array) => {
  let reduce = array.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
  return Object.assign(map, reduce);
}

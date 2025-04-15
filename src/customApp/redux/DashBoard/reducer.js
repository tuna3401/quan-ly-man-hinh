import actions from "./action";

const initState = {
  dataDB: {},
  loadingDB: false,
};

const reducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.DASHBOARD_GET_INIT:
      return {
        ...state,
        loadingDB: true,
      };
    case actions.DASHBOARD_GET_INIT_SUCCESS:
      return {
        ...state,
        dataDB: payload.dataDB,
        loadingDB: false,
      };
    case actions.DASHBOARD_GET_INIT_ERROR:
      return {
        ...state,
        dataDB: {},
        loadingDB: false,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;

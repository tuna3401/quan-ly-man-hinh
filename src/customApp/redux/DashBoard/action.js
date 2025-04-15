const actions = {
  DASHBOARD_GET_LIST: "DASHBOARD_GET_LIST",
  DASHBOARD_GET_LIST_SUCCESS: "DASHBOARD_GET_LIST_SUCCESS",
  DASHBOARD_GET_LIST_ERROR: "DASHBOARD_GET_LIST_ERROR",

  getData: (filterData) => ({
    type: actions.DASHBOARD_GET_LIST,
    payload: { filterData },
  }),
  DASHBOARD_GET_INIT: "DASHBOARD_GET_INIT",
  DASHBOARD_GET_INIT_SUCCESS: "DASHBOARD_GET_INIT_SUCCESS",
  DASHBOARD_GET_INIT_ERROR: "DASHBOARD_GET_INIT_ERROR",

  getInit: (filterData) => ({
    type: actions.DASHBOARD_GET_INIT,
    payload: { filterData },
  }),
};

export default actions;

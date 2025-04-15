import { getRoleByKey } from "../../../../helpers/utility";

const actions = {
  SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST:
    "SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST",
  SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_SUCCESS:
    "SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_SUCCESS",
  SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_ERROR:
    "SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_ERROR",
  getInitData: (filterData) => {
    return (disPatch, getState) => {
      //get role
      let listRole = getState().Auth.role;
      let role = getRoleByKey(listRole, "di-san");
      //-------
      disPatch({
        type: actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST,
        payload: { filterData, role },
      });
    };
  },

  SCHEDULEPLAYLIST_GET_LIST_REQUEST: "SCHEDULEPLAYLIST_GET_LIST_REQUEST",
  SCHEDULEPLAYLIST_GET_LIST_REQUEST_SUCCESS:
    "SCHEDULEPLAYLIST_GET_LIST_REQUEST_SUCCESS",
  SCHEDULEPLAYLIST_GET_LIST_REQUEST_ERROR:
    "SCHEDULEPLAYLIST_GET_LIST_REQUEST_ERROR",
  getList: (filterData) => ({
    type: actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST,
    payload: { filterData },
  }),
  //get notification
  getGuild: () => ({ type: "GET_NOTIFICATION_REQUEST_TO_APP_SAGA" }),
};
export default actions;

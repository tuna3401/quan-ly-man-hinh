import actions from "./actions";

const initState = {
  role: { view: 0, add: 0, edit: 0, delete: 0 },
  dataSchedulePlayList: {},
  DanhSachLoaiSuKien: [],
  DanhSachMediaOrPhat: [],
  DanhSachManHinhOrNhomManHinh: [],
  TotalRow: 0,
  loading: false,
};

export default function Reducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    //get initData
    case actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST:
      return {
        ...state,
      };
    case actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_SUCCESS:
      console.log(payload, "payload");
      return {
        ...state,
        DanhSachLoaiSuKien: payload.DanhSachLoaiSuKien,
        DanhSachMediaOrPhat: payload.DanhSachMediaOrPhat,
        DanhSachManHinhOrNhomManHinh: payload.DanhSachManHinhOrNhomManHinh,
      };
    case actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_ERROR:
      return {
        ...state,
        DanhSachLoaiSuKien: [],
        DanhSachMediaOrPhat: [],
        DanhSachManHinhOrNhomManHinh: [],
      };
    //get list
    case actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST_SUCCESS:
      return {
        ...state,
        dataSchedulePlayList: payload.dataSchedulePlayList,
        // AllHuongDan: payload.AllHuongDan,
        TotalRow: payload.TotalRow,
        loading: false,
      };
    case actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST_ERROR:
      return {
        ...state,
        dataSchedulePlayList: {},
        TotalRow: 0,
        loading: false,
      };
    default:
      return state;
  }
}

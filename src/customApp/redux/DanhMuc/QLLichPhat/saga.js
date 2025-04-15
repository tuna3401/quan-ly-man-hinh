import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../../containers/DanhMuc/QLLichPhat/config";
import apiDB from "../../../containers/DashBoash/config";
import actions from "./actions";
function* getInitData({ payload }) {
  try {
    const responseLoaiSuKien = yield call(
      api.danhSachLoaiSuKien,
      payload.filterData
    );
    const responseMediaOrPhat = yield call(
      api.danhSachMediaorPhat,
      payload.filterData
    );
    const responseManHinhOrNhomManHinh = yield call(
      api.danhSachManHinhOrNhomManHinh,
      payload.filterData
    );
    console.log(responseLoaiSuKien, "responseLoaiSuKien");
    yield put({
      type: actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachLoaiSuKien: responseLoaiSuKien.data.Data,
        DanhSachMediaOrPhat: responseMediaOrPhat.data.Data,
        DanhSachManHinhOrNhomManHinh: responseManHinhOrNhomManHinh.data.Data,
        TotalRow: responseLoaiSuKien.data.TotalRow,
      },
    });
  } catch (e) {
    console.log(e, "error");
    yield put({
      type: actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST_ERROR,
    });
  }
}
function* getList({ payload }) {
  try {
    // apiDB.GetDataDb
    console.log(payload, "payload");
    const response = yield call(
      payload.filterData.activeTab === "1"
        ? api.danhSachNgheNhan
        : apiDB.GetDataDb,
      payload.filterData
    );

    // const responseAll = yield call(api.danhSachHuongDan, {
    //   PageNumber: 1,
    //   PageSize: 1000,
    // });
    yield put({
      type: actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST_SUCCESS,
      payload: {
        dataSchedulePlayList:
          payload.filterData.activeTab === "1"
            ? response.data.Data
            : response.data.Data.LichPhats,
        TotalRow: response.data.TotalRow,
      },
    });
  } catch (e) {
    yield put({
      type: actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST_ERROR,
    });
  }
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(
      actions.SCHEDULEPLAYLIST_GET_INIT_DATA_REQUEST,
      getInitData
    ),
  ]);
  yield all([
    yield takeEvery(actions.SCHEDULEPLAYLIST_GET_LIST_REQUEST, getList),
  ]);
}

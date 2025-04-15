import { message } from "antd";
import { all, takeEvery, put, call } from "redux-saga/effects";
import api from "../../containers/DashBoash/config";
import actions from "./action";

function* getInit({ payload }) {
  try {
    const response = yield call(api.GetDataDb);
    console.log(response, "response");
    yield put({
      type: actions.DASHBOARD_GET_INIT_SUCCESS,
      payload: {
        dataDB: response.data.Data,
      },
    });
  } catch (e) {
    console.log(e, "error");
    yield put({
      type: actions.DASHBOARD_GET_INIT_ERROR,
    });
  }
}

function* getListSoLieu({ payload }) {
  try {
    const response = yield call(api.DanhSachCanhBaoV2, payload.filterData);
    yield put({
      type: actions.SOLIEUCANHBAO_GET_LIST_SUCCESS,
      payload: {
        SoLieuCanhBao: response.data.Data.SoLieuCanhBao,
      },
    });
  } catch (e) {
    yield put({
      type: actions.SOLIEUCANHBAO_GET_LIST_ERROR,
    });
  }
}

export default function* get() {
  yield all([yield takeEvery(actions.DASHBOARD_GET_INIT, getInit)]);
}

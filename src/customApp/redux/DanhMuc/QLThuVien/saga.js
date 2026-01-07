import { all, takeEvery, put, call } from 'redux-saga/effects';
import api from '../../../containers/DanhMuc/QLThuVien/config';
import actions from './actions';
function* getInitData({ payload }) {
  try {
    const response = yield call(api.danhSachDMThuVien, payload.filterData);
    const responseMedia = yield call(api.DanhSachMedia, payload.filterData);
    const responseNguoiDung = yield call(api.DanhSachNguoiDung, payload.filterData);

    yield put({
      type: actions.QLTHUVIEN_GET_INIT_DATA_REQUEST_SUCCESS,
      payload: {
        DanhSachDMThuVien: response.data.Data.Data,
        DanhSachMedia: responseMedia.data.Data,
        DanhSachNguoiDung: responseNguoiDung.data.Data,
        TotalRow: response.data.TotalRow,
      },
    });
  } catch (e) {
    yield put({
      type: actions.QLTHUVIEN_GET_INIT_DATA_REQUEST_ERROR,
    });
  }
}
function* getList({ payload }) {
  try {
    const response = yield call(api.danhSachQLThuVien, payload.filterData);
    yield put({
      type: actions.QLTHUVIEN_GET_LIST_REQUEST_SUCCESS,
      payload: {
        DanhSachQLThuVien: response.data.Data,
        TotalRow: response.data.TotalRow,
      },
    });
  } catch (e) {
    yield put({
      type: actions.QLTHUVIEN_GET_LIST_REQUEST_ERROR,
    });
  }
}
export default function* rootSaga() {
  yield all([
    yield takeEvery(actions.QLTHUVIEN_GET_INIT_DATA_REQUEST, getInitData),
  ]);
  yield all([yield takeEvery(actions.QLTHUVIEN_GET_LIST_REQUEST, getList)]);
}

import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {
  getToken,
  clearToken,
  getConfigValueByKey,
  getConfigLocal,
  getLocalKey,
} from '../../helpers/utility';
import actions from './actions';
import api from '../../containers/Page/config';
import { apiUrl } from '../../containers/Page/config';
import axios from 'axios';
import { history } from '../store';
import Pako from 'pako';
import { getTokenDecode } from '../../helpers/utility';
import { createTreeSidebar } from '../../helpers/utility';
export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function* ({ payload }) {
    try {
      const { data } = payload;
      if (data.Status > 0) {
        const access_token = data.Data;
        // const realToken = getTokenDecode(access_token);
        //get data config
        // const ListConfig = yield call(api.getListConfig, {PageSize: 999});
        const ListConfig = yield axios.get(apiUrl.listconfig, {
          params: { PageSize: 999, PageNumber: 1 },
          headers: {
            Authorization: `Bearer ${data.Data}`,
          },
        });
        let dataConfig = {};
        if (ListConfig.data.Status > 0) {
          const ListDataConfig = ListConfig.data.Data;
          const pageSize = getConfigValueByKey(ListDataConfig, 'PAGE_SIZE', 20);
          const fileLimit = getConfigValueByKey(
            ListDataConfig,
            'FILE_LIMIT',
            10,
          );
          const thanhTraTinh = getConfigValueByKey(
            ListDataConfig,
            'Thanh_Tra_Tinh_ID',
            0,
          );
          const namTrienKhai = getConfigValueByKey(
            ListDataConfig,
            'namTrienKhai',
            new Date().getFullYear(),
          );
          const tenDonVi = getConfigValueByKey(
            ListDataConfig,
            'Ten_Don_Vi',
            '',
          );
          const tinhTrienKhai = getConfigValueByKey(
            ListDataConfig,
            'TINH_TRIEN_KHAI',
            '',
          );
          const DanToc = getConfigValueByKey(ListDataConfig, 'DanToc', '');
          const QuocTich = getConfigValueByKey(ListDataConfig, 'QuocTich', '');
          //
          dataConfig = {
            pageSize,
            fileLimit,
            coQuanThanhTraTinhID: thanhTraTinh,
            namTrienKhai,
            tenDonVi,
            tinhTrienKhai,
            DanToc,
            QuocTich,
          };
        }
        yield put({
          type: actions.LOGIN_SUCCESS,
          access_token,
          // role,
          dataConfig,
        });
      }
    } catch (e) {
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function* (payload) {
    yield localStorage.setItem(
      'access_token',
      JSON.stringify(payload.access_token),
    );
    yield localStorage.setItem(
      'data_config',
      JSON.stringify(payload.dataConfig),
    );
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function* () { });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function* () {
    // logoutSSO();
    clearToken();
    const id_token_hint = JSON.parse(localStorage.getItem('user'))?.id_token;
    if (!id_token_hint) {
      yield put(push('/signin'));
    }
  });
}

export function* checkAuthorization(key) {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function* () {
    try {
      const accessToken = getLocalKey('access_token');
      if (!accessToken) {
        clearToken();
        if (window.location.pathname !== '/signin' && window.location.pathname !== '/quen-mat-khau') {
          yield put(push('/signin'));
        }
        return;
      }
      // const oldTokenDeocde = getTokenDecode(accessToken);
      const responseToken = yield axios.post(apiUrl.refreshtoken, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const newToken = responseToken.data.Data;
      // const newTokenDecode = getTokenDecode(newToken);
      if (newToken) {
        const ListConfig = yield axios.get(apiUrl.listconfig, {
          params: { PageSize: 999 },
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        let dataConfig = {};
        if (ListConfig.data.Status > 0) {
          const ListDataConfig = ListConfig.data.Data;
          const pageSize = getConfigValueByKey(ListDataConfig, 'PAGE_SIZE', 20);
          const fileLimit = getConfigValueByKey(
            ListDataConfig,
            'FILE_LIMIT',
            10,
          );
          const thanhTraTinh = getConfigValueByKey(
            ListDataConfig,
            'THANH_TRA_TINH_ID',
            0,
          );
          const namTrienKhai = getConfigValueByKey(
            ListDataConfig,
            'namTrienKhai',
            new Date().getFullYear(),
          );
          const tenDonVi = getConfigValueByKey(
            ListDataConfig,
            'TEN_DON_VI',
            '',
          );
          const tinhTrienKhai = getConfigValueByKey(
            ListDataConfig,
            'TINH_TRIEN_KHAI',
            '',
          );
          const DanToc = getConfigValueByKey(ListDataConfig, 'DanToc', '');
          const QuocTich = getConfigValueByKey(ListDataConfig, 'QuocTich', '');
          //
          dataConfig = {
            pageSize,
            fileLimit,
            coQuanThanhTraTinhID: thanhTraTinh,
            namTrienKhai,
            tenDonVi,
            DanToc,
            QuocTich,
            tinhTrienKhai,
          };
        }
        yield put({
          type: actions.LOGIN_SUCCESS,
          profile: 'Profile',
          access_token: newToken,
          dataConfig,
        });
      } else {
        clearToken();
        if (window.location.pathname !== '/quen-mat-khau') {
          yield put(push('/signin'));
        }
      }
    } catch (err) {
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
  ]);
}

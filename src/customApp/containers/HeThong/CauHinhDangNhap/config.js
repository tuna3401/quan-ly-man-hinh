import { apiGet, apiGetAuth, apiPostAuth, apiPutAuth } from '../../../../api';
import server from '../../../../settings';
import { getDefaultPageSize } from '../../../../helpers/utility';

const apiUrl = {
  getall: server.v2Url + 'CauHinhDangNhap/getAll',
  updateinfoconfigure: server.v2Url + 'CauHinhDangNhap/update',
  insertconfig: server.v2Url + 'CauHinhDangNhap/insert',
};
const api = {
  GetAll: (params) => {
    return apiGet(apiUrl.getall, { ...params });
  },
  UpdateInfoConfigure: (params) => {
    return apiPostAuth(apiUrl.updateinfoconfigure, { ...params });
  },
  InsertConfig: (params) => {
    return apiGetAuth(apiUrl.insertconfig, { ...params });
  },
};
export { apiUrl };
export default api;

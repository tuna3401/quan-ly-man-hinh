import { apiGetAuth, apiPostAuth } from "../../../api";
import server from "../../../settings";

const apiUrl = {
  getdatadb: server.v2Url + "Dashboard/GetDashboard",
  getdevice: server.v2Url + "Dashboard/GetThietBi",
};
const api = {
  GetDataDb: (params) => {
    return apiGetAuth(apiUrl.getdatadb, {
      ...params,
    });
  },
  GetDevice: (params) => {
    return apiGetAuth(apiUrl.getdevice, {
      ...params,
    });
  },
};

export default api;

import { apiGetAuth, apiPostAuth, apiDownloadAuth } from '../../../../api';
import server from '../../../../settings';
import { getDefaultPageSize } from '../../../../helpers/utility';

export const apiUrl = {
  danhsachnghenhan: server.v2Url + 'QuanLyLichPhat/GetListPaging',
  themnghenhan: server.v2Url + 'QuanLyLichPhat/Insert',
  chitietnghenhan: server.v2Url + 'QuanLyLichPhat/ChiTiet',
  suanghenhan: server.v2Url + 'QuanLyLichPhat/Update',
  xoanghenhan: server.v2Url + 'QuanLyLichPhat/Delete',
  danhsachdanhmucdisanvanhoaphivatthe:
    server.v2Url + 'QuanLyDanhMucDiSanVanHoaPhiVatThe/GetListPaging',
  danhsachloaisukien: server.v2Url + 'QuanLyLichPhat/LoaiSuKien',
  danhsachmediaorphat: server.v2Url + 'QuanLyLichPhat/GetDanhSachMediaOrDanhSachPhat',
  danhsachmanhinhornhommanhinh: server.v2Url + 'QuanLyLichPhat/GetManHinhOrNhomManHinh',
  danhsachnguoidung: server.v2Url + 'DanhMucCoQuanDonVi/GetAll',
};
const api = {
  DanhSachNguoiDung: (param) => {
    return apiGetAuth(apiUrl.danhsachnguoidung, {
      ...param,
    });
  },
  danhSachNgheNhan: (param) => {
    // Remove activeTab from params as it's only for frontend tab switching
    const { activeTab, ...apiParams } = param || {};
    return apiGetAuth(apiUrl.danhsachnghenhan, {
      ...apiParams,
      PageNumber: apiParams.PageNumber || 1,
      PageSize: apiParams.PageSize || getDefaultPageSize(),
    });
  },
  danhSachLoaiSuKien: (param) => {
    return apiGetAuth(apiUrl.danhsachloaisukien, {
      ...param,
    });
  },
  danhSachMediaorPhat: (param) => {
    return apiGetAuth(apiUrl.danhsachmediaorphat, {
      ...param,
    });
  },
  danhSachManHinhOrNhomManHinh: (param) => {
    return apiGetAuth(apiUrl.danhsachmanhinhornhommanhinh, {
      ...param,
    });
  },
  danhSachDanhMucDiSanVanHoaPhiVatThe: (param) => {
    return apiGetAuth(apiUrl.danhsachdanhmucdisanvanhoaphivatthe, {
      ...param,
    });
  },
  themNgheNhan: (param) => {
    return apiPostAuth(apiUrl.themnghenhan, {
      ...param,
    });
  },
  chiTietNgheNhan: (param) => {
    return apiGetAuth(apiUrl.chitietnghenhan, param);
  },
  suaNgheNhan: (param) => {
    return apiPostAuth(apiUrl.suanghenhan, {
      ...param,
    });
  },
  xoaNgheNhan: (lichPhatID, param) => {
    const url = `${apiUrl.xoanghenhan}?lichPhatID=${lichPhatID}`;
    return apiPostAuth(url, param);
  },
};

export default api;

import { apiGetAuth, apiPostAuth, apiDownloadAuth } from '../../../../api';
import server from '../../../../settings';
import { getDefaultPageSize } from '../../../../helpers/utility';

export const apiUrl = {
  danhsachqlthuvien: server.v2Url + 'QuanLyDanhSachPhat/GetListPaging',
  danhsachmedia: server.v2Url + 'QuanLyMedia/GetListPaging',
  themqlthuvien: server.v2Url + 'QuanLyDanhSachPhat/Insert',
  chitietqlthuvien: server.v2Url + 'QuanLyDanhSachPhat/ChiTiet',
  chitietthietlap: server.v2Url + 'QuanLyDanhSachPhat/ChiTiet_ThietLapDanhSachPhat',
  suaqlthuvien: server.v2Url + 'QuanLyDanhSachPhat/Update',
  xoaqlthuvien: server.v2Url + 'QuanLyDanhSachPhat/Delete',
  danhsachdmthuvien: server.v2Url + 'ThuMuc/GetListPaging',
  danhsachnguoidung: server.v2Url + 'DanhMucCoQuanDonVi/api/v2/DanhMucCoQuanDonVi/DanhSachCacCap',
  themthietlap: server.v2Url + 'QuanLyDanhSachPhat/Update_ThietLapDanhSachPhat',
  danhsachthumuc: server.v2Url + 'ThuMuc/GetListPaging',
  themmedia: server.v2Url + 'QuanLyMedia/Insert',
};
const api = {
  danhSachQLThuVien: (param) => {
    return apiGetAuth(apiUrl.danhsachqlthuvien, {
      ...param,
      PageNumber: param.PageNumber ? param.PageNumber : 1,
      PageSize: param.PageSize ? param.PageSize : getDefaultPageSize(),
    });
  },
  DanhSachMedia: (param) => {
    // Clean up parameters - remove empty strings
    const cleanParams = {};

    if (param.Loai) cleanParams.Loai = param.Loai;
    if (param.Keyword) cleanParams.Keyword = param.Keyword;
    if (param.ThuMucID) cleanParams.ThuMucID = param.ThuMucID;
    if (param.Status !== undefined && param.Status !== '') cleanParams.Status = param.Status;

    // Always include PageNumber and PageSize with defaults
    cleanParams.PageNumber = param.PageNumber || 1;
    cleanParams.PageSize = param.PageSize || getDefaultPageSize();

    return apiGetAuth(apiUrl.danhsachmedia, cleanParams);
  },
  DanhSachNguoiDung: (param) => {
    return apiGetAuth(apiUrl.danhsachnguoidung, {
      ...param,
    });
  },
  danhSachDMThuVien: (param) => {
    return apiGetAuth(apiUrl.danhsachdmthuvien, {
      ...param,
    });
  },
  themQLThuVien: (param) => {
    return apiPostAuth(apiUrl.themqlthuvien, {
      ...param,
    });
  },
  themThietLap: (param) => {
    return apiPostAuth(apiUrl.themthietlap, {
      ...param,
    });
  },
  themMedia: (param) => {
    return apiPostAuth(apiUrl.themmedia, {
      ...param,
    });
  },
  chiTietQLThuVien: (param) => {
    return apiGetAuth(apiUrl.chitietqlthuvien, param);
  },
  chiTietThietLap: (param) => {
    return apiGetAuth(apiUrl.chitietthietlap, param);
  },
  suaQLThuVien: (param) => {
    return apiPostAuth(apiUrl.suaqlthuvien, {
      ...param,
    });
  },
  xoaQLThuVien: (DanhSachPhatID, param) => {
    const url = `${apiUrl.xoaqlthuvien}?DanhSachPhatID=${DanhSachPhatID}`;
    return apiPostAuth(url, param);
  },
  DanhSachThuMuc: (param) => {
    return apiGetAuth(apiUrl.danhsachthumuc, {
      ...param,
    });
  },
};

export default api;

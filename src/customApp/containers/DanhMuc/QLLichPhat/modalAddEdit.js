import React, { useEffect, useRef, useState } from "react";
import {
  ITEM_LAYOUT2,
  ITEM_LAYOUT,
  ITEM_LAYOUT_SMALL_2,
  REQUIRED,
} from "../../../../settings/constants";
import { Form, Space, Select, DatePicker, TimePicker, Row, Col } from "antd";
import {
  Button,
  Modal,
  InputFormatSpecific,
  Input,
  InputNumberFormat,
  Radio,
} from "../../../../components/uielements/exportComponent";
import {
  BorderOutlined,
  CheckSquareOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DatePickerFormat from "../../../../components/uielements/datePickerFormat";
// import DatePicker from '../../../../components/uielements/datePickerFormat';
import { checkInputNumber } from "../../../../helpers/utility";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import api from "./config";
import dayjs from "dayjs";

import {
  _debounce,
  getInfoFromToken,
  getLocalKey,
} from "../../../../helpers/utility";
const { Item, useForm } = Form;

export default (props) => {
  const [form] = useForm();
  // const [isFormSuccess, setIsFormSuccess] = useState(true);
  const {
    dataEdit,
    loading,
    visible,
    action,
    DanhSachLoaiSuKien,
    DanhSachMediaOrPhat,
  } = props;
  const [DanhSachMenu, setDanhSachMenu] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [ChiaNgay, setChiaNgay] = useState(false);
  const access_token1 = getLocalKey("access_token");
  const dataUnzip1 = getInfoFromToken(access_token1);
  const ListNguoiDung = dataUnzip1?.NguoiDung?.NguoiDungID;
  const hideSelect = ListNguoiDung !== 18;
  const [DanhSachManHinhOrNhomManHinh, setDanhSachManHinhOrNhomManHinh] =
    useState([]);

  useEffect(() => {
    if (dataEdit && dataEdit.LichPhatID) {
      const LoaiSuKienValue = dataEdit.LoaiSuKien;
      setSelectedLoaiSuKien(LoaiSuKienValue);

      const ListManHinhOrNhomManHinhs = dataEdit.ListManHinhOrNhomManHinh;
      const fieldsValue = {
        ...dataEdit,
        ListManHinhOrNhomManHinh: ListManHinhOrNhomManHinhs?.map(
          (item) => item.ID
        ),
      };

      // Handle date for ChiaNgay = true
      if (dataEdit.DanhSachNgayPhats && dataEdit.DanhSachNgayPhats.length > 0) {
        const ChiTietLichPhat = dataEdit.DanhSachNgayPhats.map((item) => {
          const ngayPhatValue = Array.isArray(item.DanhSachNgayPhat) && item.DanhSachNgayPhat.length > 0
            ? item.DanhSachNgayPhat[0]
            : item.DanhSachNgayPhat;
          return {
            NgayPhat: dayjs(ngayPhatValue),
            GioBatDau: dayjs(`0000/01/01 ${item.GioBatDau}`, 'YYYY/MM/DD HH:mm:ss'),
            GioKetThuc: dayjs(`0000/01/01 ${item.GioKetThuc}`, 'YYYY/MM/DD HH:mm:ss'),
          };
        });
        fieldsValue.ChiTietLichPhat = ChiTietLichPhat;
      }

      form.setFieldsValue(fieldsValue);
      setChiaNgay(dataEdit.ChiaNgay);
    }
  }, [dataEdit, form]);

  useEffect(() => {
    handleGetManHinhOrNhomManHinh();
  }, []);

  const handleGetManHinhOrNhomManHinh = async () => {
    try {
      const res = await api.danhSachManHinhOrNhomManHinh({
        coQuanID: form.getFieldValue("CoQuanID"),
      });
      if (res.data.Status > 0) {
        setDanhSachManHinhOrNhomManHinh(res.data.Data);
      } else {
        message.destroy();
        message.warning(res.data.Message);
      }
    } catch (error) {
      message.destroy();
      message.error("An error occurred while fetching data");
    } finally {
    }
  };
  const access_token = getLocalKey("access_token");
  const dataUnzip = getInfoFromToken(access_token);
  const ListChucNang = dataUnzip?.NguoiDung?.CoQuanID;
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await api.DanhSachNguoiDung(/* Tham số */);
      if (res.data.Status > 0) {
        setDanhSachMenu(res.data.Data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cấp xếp hạng:", error);
    }
  };
  const onOk = async (e) => {
    e.preventDefault();
    try {
      const values = await form.validateFields();

      const transformedList = values.ListManHinhOrNhomManHinh?.map((id) => {
        const selectedItem = DanhSachManHinhOrNhomManHinh.find(
          (item) => item.ID === id
        );
        return {
          ID: selectedItem.ID,
          Ten: selectedItem.Ten,
          Title: selectedItem.Title,
        };
      });

      const selectedMediaOrPlaylist = danhSachMauPhieuSuggest.find(
        (item) => item.ID === values.MediaORDanhSachPhat
      );

      const payload = {
        ...values,
        CoQuanID: hideSelect ? ListChucNang : values.CoQuanID,
        ListManHinhOrNhomManHinh: transformedList,
        TitleMediaORDanhSachPhat: selectedMediaOrPlaylist?.Title,
      };
      if (ChiaNgay) {
        const DataChiTietLichPhat = values.ChiTietLichPhat || [];
        const DanhSachNgayPhat = DataChiTietLichPhat.map(item => ({
          DanhSachNgayPhat: [item.NgayPhat.format('YYYY-MM-DDTHH:mm:ss')],
          GioBatDau: item.GioBatDau.format('HH:mm:ss'),
          GioKetThuc: item.GioKetThuc.format('HH:mm:ss'),
        }));

        payload.DanhSachNgayPhat = DanhSachNgayPhat;

        // Remove date/time fields from payload
        delete payload.ChiTietLichPhat;
        delete payload.NgayPhat;
        delete payload.GioBatDau;
        delete payload.GioKetThuc;
      } else {
        payload.DanhSachNgayPhat = [];
      }

      props.onCreate(payload);
    } catch (errorInfo) {
      console.error("Validation failed:", errorInfo);
    }
  };

  const [danhSachMauPhieuSuggest, setDanhSachMauPhieuSuggest] = useState([]);

  const [selectedLoaiSuKien, setSelectedLoaiSuKien] = useState(null);
  useEffect(() => {
    handleGetListSuggest(selectedLoaiSuKien);
  }, [selectedLoaiSuKien]);

  const handleGetListSuggest = async (LoaiSuKien) => {
    if (!LoaiSuKien) return;
    try {
      const res = await api.danhSachMediaorPhat({
        title: LoaiSuKien,
        coQuanID: form.getFieldValue("CoQuanID"),
      });
      if (res.data.Status > 0) {
        setDanhSachMauPhieuSuggest(res.data.Data);
      } else {
        message.destroy();
        message.warning(res.data.Message);
      }
    } catch (error) {
      message.destroy();
      message.error("An error occurred while fetching data");
    } finally {
    }
  };


  return (
    <Modal
      title={`${action === "edit" ? "Sửa" : "Thêm mới"} lịch phát`}
      width={750}
      visible={visible}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          form="formDiSanTuLieu"
          // loading={loading}
          onClick={onOk}
        // disabled={isFormSuccess}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} name={"formDiSanTuLieu"}>
        {action !== "add" ? (
          <Item name="LichPhatID" hidden {...REQUIRED}></Item>
        ) : null}
        {/* <Item name="CoQuanID" hidden {...REQUIRED}></Item> */}
        {!hideSelect && (
          <Item
            label="Chọn khách hàng"
            name={"CoQuanID"}
            {...ITEM_LAYOUT}
            rules={[REQUIRED]}
          >
            <Select
              allowClear
              onChange={(value) => {
                form.setFieldsValue({ MediaORDanhSachPhat: undefined });
                form.setFieldsValue({ ListManHinhOrNhomManHinh: undefined }); // Clear Media/Danh sách phát
                handleGetListSuggest(selectedLoaiSuKien); // Call handleGetListSuggest with the current selectedLoaiSuKien
                handleGetManHinhOrNhomManHinh(); // Call handleGetManHinhOrNhomManHinh when a value is selected
              }}
            // style={{width: '200px'}}
            >
              {DanhSachMenu?.map((item) => (
                <Option value={item.ID}>{item.Ten}</Option>
              ))}
            </Select>
          </Item>
        )}
        <Item label="Tên danh sách phát" name={"TenLichPhat"} {...ITEM_LAYOUT}>
          <Input />
        </Item>
        <Item
          label="Loại thư viện"
          name={"LoaiSuKien"}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Select
            allowClear
            onChange={(value) => {
              setSelectedLoaiSuKien(value);
              form.setFieldsValue({ MediaORDanhSachPhat: undefined }); // Clear Media/Danh sách phát
            }}
          // style={{width: '200px'}}
          >
            {DanhSachLoaiSuKien?.map((item) => (
              <Option value={item.ID}>{item.TenSuKien}</Option>
            ))}
          </Select>
        </Item>
        <Item
          label="Media/Danh sách phát"
          name={"MediaORDanhSachPhat"}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Select
            allowClear
          // style={{width: '200px'}}
          >
            {danhSachMauPhieuSuggest?.map((item) => (
              <Option value={item.ID}>{item.Ten}</Option>
            ))}
          </Select>
        </Item>
        <Item
          label="Màn hình/Nhóm màn hình "
          name={"ListManHinhOrNhomManHinh"}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Select
            mode="multiple"
            allowClear
          // style={{width: '200px'}}
          >
            {DanhSachManHinhOrNhomManHinh?.map((item) => (
              <Option value={item.ID}>{item.Ten}</Option>
            ))}
          </Select>
        </Item>
        <Item
          label="Chia ngày"
          name={"ChiaNgay"}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Select onChange={(value) => setChiaNgay(value)}>
            <Option value={true}>Tùy chỉnh</Option>
            <Option value={false}>Luôn Luôn</Option>
          </Select>
        </Item>
        {ChiaNgay && (
          <>
            <Form.List name="ChiTietLichPhat">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row gutter={10} key={key} style={{ display: "flex", alignItems: "flex-start", marginBottom: 10 }}>
                      <Col span={9}>
                        <Item
                          {...restField}
                          name={[name, "NgayPhat"]}
                          fieldKey={[fieldKey, "NgayPhat"]}
                          rules={[REQUIRED]}
                          label="Chọn ngày"
                        >
                          <DatePicker
                            format="DD/MM/YYYY"
                            placeholder=""
                            style={{ width: "100%" }}
                          />
                        </Item>
                      </Col>
                      <Col span={7}>
                        <Item
                          {...restField}
                          name={[name, "GioBatDau"]}
                          fieldKey={[fieldKey, "GioBatDau"]}
                          rules={[REQUIRED]}
                          label="Bắt đầu"
                        >
                          <TimePicker
                            placeholder="Giờ bắt đầu"
                            format="HH:mm:ss"
                            style={{ width: "100%" }}
                          />
                        </Item>
                      </Col>
                      <Col span={7}>
                        <Item
                          {...restField}
                          name={[name, "GioKetThuc"]}
                          fieldKey={[fieldKey, "GioKetThuc"]}
                          rules={[REQUIRED]}
                          label="Kết thúc"
                        >
                          <TimePicker
                            placeholder="Giờ kết thúc"
                            format="HH:mm:ss"
                            style={{ width: "100%" }}
                          />
                        </Item>
                      </Col>
                      <Col span={1} style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
                        <DeleteOutlined onClick={() => remove(name)} style={{ color: "red", fontSize: "18px", cursor: "pointer" }} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm mốc thời gian mới
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        )}

        <Item
          label="Thứ tự hiển thị"
          name={"ThuTu"}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <InputNumberFormat />
        </Item>
        <Item
          label="Trạng thái"
          name={"TrangThai"}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Select>
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Không hoạt</Option>
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};

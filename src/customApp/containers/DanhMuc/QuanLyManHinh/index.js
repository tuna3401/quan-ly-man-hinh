import { Modal, Tooltip, message, Row, Col, Pagination } from "antd";
import actions from "../../../redux/DanhMuc/QuanLyManHinh/actions";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import LayoutWrapper from "../../../../components/utility/layoutWrapper";
import PageHeader from "../../../../components/utility/pageHeader";
import PageAction from "../../../../components/utility/pageAction";
import Box from "../../../../components/utility/box";
import BoxFilter from "../../../../components/utility/boxFilter";
import {
  Button,
  InputSearch,
  Select,
} from "../../../../components/uielements/exportComponent";
import {
  changeUrlFilter,
  getDefaultPageSize,
  getFilterData,
  getRoleByKey,
} from "../../../../helpers/utility";
import { useKey } from "../../../CustomHook/useKey";
import queryString from "query-string";
import api from "./config";
import ModalAddEdit from "./modalAddEdit";
import { PlusOutlined } from "@ant-design/icons";
import PageWrap from "../../../../components/utility/PageWrap";
import DeviceCard from "./DeviceCard";
import BoxTable from "../../../../components/utility/boxTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  getLocalKey,
  getInfoFromToken,
} from "../../../../helpers/utility";
import { IDS } from "../../../../settings/constants";

const QuanLyManHinh = (props) => {
  const [filterData, setFilterData] = useState({
    ...queryString.parse(props.location.search),
    PageSize: queryString.parse(props.location.search).PageSize || 6,
  });

  const [dataModalAddEdit, setDataModalAddEdit] = useState([]);
  const [visibleModalAddEdit, setVisibleModalAddEdit] = useState(false);
  const [action, setAction] = useState("");
  const [modalKey, inceaseModalKey] = useKey();
  const [confirmLoading, setConfirmLoading] = useState(false);

  document.title = "Quản Lý Màn Hình";

  useEffect(() => {
    changeUrlFilter(filterData);
    props.getList(filterData);
  }, [filterData]);

  useEffect(() => {
    props.getList(filterData);
  }, []);

  const onFilter = (value, property) => {
    let oldFilterData = filterData;
    let onFilter = { value, property };
    let newfilterData = getFilterData(oldFilterData, onFilter, null);
    setFilterData(newfilterData);
  };

  const showModalAdd = () => {
    setAction("add");
    setDataModalAddEdit({});
    inceaseModalKey();
    setVisibleModalAddEdit(true);
  };

  const deleteModalAddEdit = (ManHinhID) => {
    Modal.confirm({
      title: "Xóa Dữ Liệu",
      content: "Bạn có muốn xóa màn hình này không?",
      cancelText: "Không",
      okText: "Có",
      onOk: () => {
        setConfirmLoading(true);
        api
          .xoaManHinh(ManHinhID, {})
          .then((res) => {
            if (res.data.Status > 0) {
              setConfirmLoading(false);
              props.getList({
                ...filterData,
                PageNumber:
                  Math.ceil((TotalRow - 1) / filterData.PageSize) <
                    filterData.PageNumber
                    ? Math.ceil((TotalRow - 1) / filterData.PageSize)
                    : filterData.PageNumber,
              });
              message.destroy();
              message.success(res.data.Message);
              setFilterData({
                ...filterData,
                PageNumber:
                  Math.ceil((TotalRow - 1) / filterData.PageSize) <
                    filterData.PageNumber
                    ? Math.ceil((TotalRow - 1) / filterData.PageSize)
                    : filterData.PageNumber,
              });
            } else {
              message.destroy();
              message.error(res.data.Message);
            }
          })
          .catch((error) => {
            message.destroy();
            message.error(error.toString());
          });
      },
    });
  };

  const showModalEdit = (manHinhID) => {
    const ManHinhID = manHinhID;
    setAction("edit");
    api
      .chiTietManHinh({ ManHinhID })
      .then((res) => {
        if (res.data.Status > 0) {
          setDataModalAddEdit(res.data.Data);
          inceaseModalKey();
          setVisibleModalAddEdit(true);
        } else {
          message.destroy();
          message.error(res.data.Message);
        }
      })
      .catch((error) => {
        message.destroy();
        message.error(error.toString());
      });
  };

  const hideModalAddEdit = () => {
    setDataModalAddEdit({});
    setVisibleModalAddEdit(false);
  };

  const submitModalAddEdit = (data) => {
    setConfirmLoading(true);
    if (action === "add") {
      api
        .themManHinh(data)
        .then((res) => {
          setConfirmLoading(false);
          if (res.data.Status > 0) {
            message.destroy();
            message.success(res.data.Message);
            hideModalAddEdit();
            props.getList(filterData);
          } else {
            setConfirmLoading(false);
            message.destroy();
            message.error(res.data.Message);
          }
        })
        .catch((error) => {
          setConfirmLoading(false);
          message.destroy();
          message.error(error.toString());
        });
    }
    if (action === "edit") {
      api
        .suaManHinh(data)
        .then((res) => {
          if (res.data.Status > 0) {
            setConfirmLoading(false);
            message.destroy();
            message.success(res.data.Message);
            hideModalAddEdit();
            props.getList(filterData);
          } else {
            setConfirmLoading(false);
            message.destroy();
            message.error(res.data.Message);
          }
        })
        .catch((error) => {
          setConfirmLoading(false);
          message.destroy();
          message.error(error.toString());
        });
    }
  };

  const onPageChange = (page, pageSize) => {
    const newFilterData = {
      ...filterData,
      PageNumber: page,
      PageSize: pageSize,
    }
    setFilterData(newFilterData);
  }

  const { DanhSachManHinh, TotalRow, role } = props;
  const PageNumber = filterData.PageNumber
    ? parseInt(filterData.PageNumber)
    : 1;
  const PageSize = filterData.PageSize
    ? parseInt(filterData.PageSize)
    : 6;

  // --- Role Check ---
  const token = getLocalKey("access_token");
  const userInfo = getInfoFromToken(token);
  const isAdmin = userInfo?.NguoiDung?.NguoiDungID === IDS.Admin;

  // --- Table Columns for Admin ---
  const columns = [
    {
      title: "STT",
      width: "5%",
      align: "center",
      render: (text, record, index) => (
        <span>{(PageNumber - 1) * PageSize + (index + 1)}</span>
      ),
    },
    {
      title: "Tên màn hình",
      dataIndex: "TenManHinh",
      width: "25%",
    },
    {
      title: "Hardware Key",
      dataIndex: "HardwareKey",
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "Mota",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      align: "center",
      width: "10%",
      render: (text, record) => (
        <span style={{ color: record.TrangThai ? "green" : "red" }}>
          {record.TrangThai ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      width: "10%",
      render: (text, record) => (
        <div>
          <Tooltip title="Sửa">
            <EditOutlined
              style={{ fontSize: 18, marginRight: 10, cursor: "pointer" }}
              onClick={() => showModalEdit(record.ManHinhID)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteOutlined
              style={{ fontSize: 18, color: "red", cursor: "pointer" }}
              onClick={() => deleteModalAddEdit(record.ManHinhID)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];



  return (
    <LayoutWrapper>
      <PageWrap>
        <PageAction>
          <Button type="primary" onClick={showModalAdd}>
            <PlusOutlined />
            Thêm mới
          </Button>
        </PageAction>
      </PageWrap>
      <Box>
        <BoxFilter>
          <InputSearch
            defaultValue={filterData.Keyword}
            placeholder={"Nhập tên hoặc HardwareKey"}
            style={{ width: 300 }}
            onSearch={(value) => onFilter(value, "Keyword")}
            allowClear
          />
        </BoxFilter>

        <div style={{ padding: '20px 0' }}>
          {isAdmin ? (
            <BoxTable
              columns={columns}
              dataSource={DanhSachManHinh}
              pagination={{
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Từ ${range[0]} đến ${range[1]} trên ${total} kết quả`,
                total: TotalRow,
                current: PageNumber,
                pageSize: PageSize,
                onChange: onPageChange,
              }}
            />
          ) : (
            <>
              {DanhSachManHinh && DanhSachManHinh.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {DanhSachManHinh.map((item) => (
                    <Col xs={24} md={12} xl={8} key={item.ManHinhID}>
                      <DeviceCard
                        data={item}
                        onEdit={showModalEdit}
                        onDelete={deleteModalAddEdit}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                  Không có dữ liệu
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Pagination
                  current={PageNumber}
                  pageSize={PageSize}
                  total={TotalRow}
                  onChange={onPageChange}
                  showSizeChanger
                  pageSizeOptions={['6', '12', '18', '24']}
                  showTotal={(total, range) => `Từ ${range[0]} đến ${range[1]} trên ${total} kết quả`}
                />
              </div>
            </>
          )}

        </div>


      </Box>
      <ModalAddEdit
        visible={visibleModalAddEdit}
        dataEdit={dataModalAddEdit}
        action={action}
        loading={confirmLoading}
        key={modalKey}
        onCreate={submitModalAddEdit}
        onCancel={hideModalAddEdit}
        DanhSachManHinh={DanhSachManHinh}
      />
    </LayoutWrapper>
  );
};

function mapStateToProps(state) {
  return {
    ...state.QuanLyManHinh,
    role: getRoleByKey(state.Auth.role, "danh-muc-chuc-vu"),
  };
}

export default connect(mapStateToProps, actions)(QuanLyManHinh);

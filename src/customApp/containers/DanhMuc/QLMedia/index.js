import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import actions from "../../../redux/DanhMuc/QLMedia/actions";
import api, { apiUrl } from "./config";
import Constants from "../../../../settings/constants";
import PageWrap from "../../../../components/utility/PageWrap";
import Select, { Option } from "../../../../components/uielements/select";
import LayoutWrapper from "../../../../components/utility/layoutWrapper";
import PageAction from "../../../../components/utility/pageAction";
import Box from "../../../../components/utility/box";
import BoxFilter from "../../../../components/utility/boxFilter";
import { EmptyTable } from "../../../../components/utility/boxTable";
import BoxTable from "../../../../components/utility/boxTable";
import { useKey } from "../../../CustomHook/useKey";
import ModalEditEdit from "./modalEdit";
import ModalEdit from "./modalAddEdit";
import {
  Modal,
  message,
  Tree,
  Menu,
  Dropdown,
  Tooltip,
  Pagination,
} from "antd";
import Button from "../../../../components/uielements/button";
import {
  changeUrlFilter,
  getFilterData,
  getDefaultPageSize,
} from "../../../../helpers/utility";
import {
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  PlusOutlined,
  FolderOpenOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import ModalAddEditMedia from "./modalAddEditMedi";
import { useSelector, useDispatch } from "react-redux";
import { InputSearch } from "../../../../components/uielements/input";
import { formDataCaller } from "../../../../api/formDataCaller";
import actionsCoQuan from "../../../redux/DanhMuc/DMCoQuan/actions";
import {
  _debounce,
  getInfoFromToken,
  getLocalKey,
} from "../../../../helpers/utility";
import '@fortawesome/fontawesome-free/css/all.min.css';
const { TreeNode } = Tree;
const DMChiTieu = (props) => {
  document.title = "Quản Lý Media";
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [filterData, setFilterData] = useState(
    queryString.parse(props.location.search)
  );
  const [filterData1, setFilterData1] = useState("");

  const [keyState, setKeyState] = useState({
    key: 0,
    treeKey: 0,
  });

  const { DanhSachCoQuan } = useSelector((state) => state.DMCoQuan);

  const [stateModalAddEdit, setStateModalAddEdit] = useState({
    confirmLoading: false,
    visibleModalAddEdit: false,
    action: "",
    dataModalAddEdit: {
      DanhSachTinh: [],
      Data: null,
    },
    modalKey: 0,
  });
  const { DanhSachMedia, TotalRow, DanhSachThuMuc } = props;
  const dispatch = useDispatch();
  const {
    confirmLoading,
    visibleModalAddEdit,
    action,
    dataModalAddEdit,
    modalKey,
  } = stateModalAddEdit;
  const { treeKey, key } = keyState;
  useEffect(() => {
    props.getInitData(filterData);
    dispatch(actions.getInitData());
    dispatch(actionsCoQuan.getInitData());
    setFilterData([]);
  }, []);

  const filterTreeNode = (dataRoot) => {
    return dataRoot;
  };

  const DSFilter = filterTreeNode(DanhSachThuMuc);
  useEffect(() => {
    changeUrlFilter(filterData); //change url
    props.getList(filterData);
  }, [filterData]);

  //filter --------------------------------------------------
  const onFilter = (value, property) => {
    //get filter data
    let oldFilterData = { ...filterData };
    let onFilter = { value, property };
    let newFilterData = getFilterData(oldFilterData, onFilter, null);
    //get filter data
    setFilterData(newFilterData);
    changeUrlFilter(newFilterData);
  };
  const onSearch = (value, property) => {
    let oldFilterData = filterData;
    let onFilter = { value, property };
    let newFilterData = getFilterData(oldFilterData, onFilter, null);
    setFilterData(newFilterData);
  };
  const deleteData = (ThuMucID) => {
    Modal.confirm({
      title: "Xóa dữ liệu",
      content: "Bạn có muốn xóa thư mục này không?",
      cancelText: "Không",
      okText: "Có",
      onOk: () => {
        api
          .XoaChiTieu(ThuMucID, {})
          .then((response) => {
            if (response.data.Status > 0) {
              dispatch(actions.getInitData()); //get list
              //message success
              message.destroy();
              message.success(response.data.Message);
            } else {
              Modal.error({
                title: "Lỗi",
                content: response.data.Message,
              });
            }
          })
          .catch((error) => {
            Modal.error(Constants.API_ERROR);
          });
      },
    });
    // }
  };

  const findObjectByThuMucID = (arr, ThuMucID) => {
    for (let i = 0; i < arr.length; i++) {
      const currentObject = arr[i];
      if (currentObject.ThuMucID === ThuMucID) {
        return currentObject;
      }
      if (currentObject.children && currentObject.children.length > 0) {
        const resultInChildren = findObjectByThuMucID(
          currentObject.children,
          ThuMucID
        );
        if (resultInChildren !== null) {
          return resultInChildren;
        }
      }
    }
    return null;
  };

  //Modal add -----------------------------------------------------
  const showModalAdd = (ThuMucID, ThuMucChaID, TenThuMuc) => {
    if (false) {
      message.destroy();
      message.warning("Bạn không có quyền thực hiện chức năng này");
    } else {
      if (!ThuMucChaID) {
        let newModalKey = modalKey + 1;
        setStateModalAddEdit((prevState) => ({
          ...prevState,
          visibleModalAddEdit: true,
          dataModalAddEdit: {
            ThuMucChaID: ThuMucID,
            TenThuMucCha: TenThuMuc,
          },
          confirmLoading: false,
          modalKey: newModalKey,
          action: "add",
        }));
      } else
        api
          .ChiTietChiTieu({ thuMucID: ThuMucID })
          .then((response) => {
            if (response.data.Status > 0) {
              let Data = response.data.Data;
              let newModalKey = modalKey + 1;
              setStateModalAddEdit((prevState) => ({
                ...prevState,
                visibleModalAddEdit: true,
                dataModalAddEdit: {
                  ThuMucChaID: ThuMucID,
                  TenThuMucCha: Data.TenThuMuc,
                },
                confirmLoading: false,
                modalKey: newModalKey,
                action: "add",
              }));
            } else {
              Modal.error({
                title: "Lỗi",
                content: response.data.Message,
              });
            }
          })
          .catch((error) => {
            message.destroy();
            message.warning(error.toString());
          });
    }
  };
  const showModalEdit = (ThuMucID, ThuMucChaID) => {
    const objParent = findObjectByThuMucID(DSFilter, ThuMucChaID);
    api
      .ChiTietChiTieu({ ThuMucID: ThuMucID })
      .then((response) => {
        if (response.data.Status > 0) {
          let Data = response.data.Data;
          let newModalKey = modalKey + 1;
          setStateModalAddEdit((prevState) => ({
            ...prevState,
            visibleModalAddEdit: true,
            dataModalAddEdit: {
              ...Data,
              ThuMucID,
              TenThuMucCha: objParent?.TenThuMuc,
              ThuMucChaID: objParent?.ThuMucID,
            },
            confirmLoading: false,
            modalKey: newModalKey,
            action: "edit",
          }));
        } else {
          Modal.error({
            title: "Lỗi",
            content: response.data.Message,
          });
        }
      })
      .catch((error) => {
        Modal.error(Constants.API_ERROR);
      });
    // }
  };

  const hideModalEdit = () => {
    setStateModalAddEdit((prevState) => ({
      dataModalAddEdit: {},
      visibleModalAddEdit: false,
      action: "",
    }));
  };

  const submitModalEdit = (data) => {
    setStateModalAddEdit((prevState) => ({
      ...prevState,
      confirmLoading: true,
    }));
    if (action === "add") {
      api
        .ThemChiTieu(data)
        .then((response) => {
          setStateModalAddEdit((prevState) => ({
            ...prevState,
            confirmLoading: false,
          }));
          if (response.data.Status > 0) {
            //message success
            message.destroy();
            message.success(response.data.Message);
            //hide modal
            hideModalEdit();
            dispatch(actions.getInitData()); //get list
          } else {
            Modal.error({
              title: "Lỗi",
              content: response.data.Message,
            });
          }
        })
        .catch((error) => {
          Modal.error(Constants.API_ERROR);
        });
    } else {
      api
        .SuaChiTieu(data)
        .then((response) => {
          setStateModalAddEdit((prevState) => ({
            ...prevState,
            confirmLoading: false,
          }));
          if (response.data.Status > 0) {
            //message success
            message.destroy();
            message.success(response.data.Message);
            //hide modal
            hideModalEdit();
            dispatch(actions.getInitData()); //get list
          } else {
            Modal.error({
              title: "Lỗi",
              content: response.data.Message,
            });
          }
        })
        .catch((error) => {
          Modal.error(Constants.API_ERROR);
        });
    }
  };
  const onExpandNode = (selectedKeys, info) => {
    let className = info.nativeEvent.target.outerHTML.toString();
    let parentClassName =
      info.nativeEvent.target.parentElement.className.toString();
    let checkMenu = className.includes("ant-dropdown-menu");
    let checkNearMenu = parentClassName.includes("ant-dropdown-menu");
    if (!checkMenu && !checkNearMenu) {
      //neu dang k click menu drop
      let key = info.node.props.eventKey.toString();
      if (key) {
        if (!info.node.props.isLeaf) {
          let newExpandedKeys = [...expandedKeys];
          let index = newExpandedKeys.indexOf(key);
          if (index > -1) {
            newExpandedKeys.splice(index, 1);
          } else {
            newExpandedKeys = newExpandedKeys.concat([key]);
          }
          setExpandedKeys(newExpandedKeys);
          setKeyState((prevKey) => ({ ...prevKey, key: selectedKeys }));
        }
      }
    }
  };
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (DSFilter.length && !initialized) {
      setTimeout(() => {
        // Assuming the first item in DSFilter is the root node
        const rootNode = DSFilter[0];
        if (rootNode) {
          const firstNodeKey = rootNode.ThuMucID.toString();
          onExpandNode([firstNodeKey], {
            node: { props: { eventKey: firstNodeKey, isLeaf: false } },
            nativeEvent: {
              target: { outerHTML: "", parentElement: { className: "" } },
            },
          });
        }
        setInitialized(true);
      }, 0); // Use setTimeout with 0 delay to ensure it runs after render
    }
  }, [DSFilter, initialized]);
  const [openMenuKey, setOpenMenuKey] = useState(null);
  console.log("openMenuKey", openMenuKey);
  const access_token = getLocalKey("access_token");
  const dataUnzip = getInfoFromToken(access_token);
  const ListNguoiDung = dataUnzip?.NguoiDung?.NguoiDungID;
  const isAdmin = ListNguoiDung === 18; // Using 18 directly as per user request/standard, or IDS.Admin if available

  // --- Table Columns for Admin ---
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: "5%",
      align: "center",
      render: (text, record, index) => (
        <span>{(PageNumber - 1) * PageSize + (index + 1)}</span>
      ),
    },
    {
      title: "Tên",
      dataIndex: "TenFile",
      key: "TenFile",
      width: "20%",
    },
    {
      title: "Thumbnail",
      key: "Thumbnail",
      width: "10%",
      align: "center",
      render: (text, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            {record.Loai === 1 ? (
              <img
                src={record.UrlFile}
                alt={record.TenFile}
                style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
              />
            ) : record.Loai === 2 ? (
              <span style={{ fontSize: "24px" }}>🎥</span>
            ) : record.Loai === 3 ? (
              <span style={{ fontSize: "24px" }}>📄</span>
            ) : record.Loai === 4 ? (
              <span style={{ fontSize: "24px" }}>📊</span>
            ) : null}
          </div>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "Loai",
      key: "Loai",
      width: "10%",
      align: "center",
      render: (loai) => {
        const map = { 1: "Hình ảnh", 2: "Video", 3: "PDF", 4: "PowerPoint" };
        return map[loai] || "Khác";
      },
    },
    {
      title: "Thời lượng trình chiếu",
      dataIndex: "ThoiLuongTrinhChieu",
      key: "ThoiLuongTrinhChieu",
      width: "15%",
      align: "center",
      render: (text) => text || "---",
    },
    {
      title: "Kích thước",
      dataIndex: "KichThuoc",
      key: "KichThuoc",
      width: "10%",
      align: "center",
      render: (text) => text ? `${(text / 1024).toFixed(2)} KB` : "---",
    },
    {
      title: "Trạng thái sử dụng",
      dataIndex: "TrangThai",
      key: "TrangThai",
      width: "15%",
      align: "center",
      render: (status) => (
        <span style={{ color: status ? "green" : "red" }}>
          {status ? "Đang sử dụng" : "Chưa sử dụng"}
        </span>
      ),
    },
    {
      title: "Tags",
      dataIndex: "Tag",
      key: "Tag",
      width: "10%",
      align: "center",
      render: (text) => text || "---",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      align: "center",
      render: (text, record) => (
        <div>
          <Tooltip title="Sửa">
            <EditOutlined
              style={{ fontSize: 18, marginRight: 10, cursor: "pointer", color: "#1890ff" }}
              onClick={() => showModalEditEdit(record.ID)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteOutlined
              style={{ fontSize: 18, color: "red", cursor: "pointer" }}
              onClick={() => deleteModalAddEdit(record.ID)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const renderTreeNodes = (data) =>
    data?.map((item) => {
      let isMenuOpen = openMenuKey === item.ThuMucID; // Kiểm tra xem menu có nên được mở không
      let isExpanded = expandedKeys.includes(item.ThuMucID.toString());
      let menu = (
        <Menu>
          <Menu.Item
            onClick={() => {
              showModalAdd(item.ThuMucID, item.ThuMucChaID, item.TenThuMuc);
              setOpenMenuKey(null); // Đóng menu khi một mục được nhấp
            }}
          >
            <span>Thêm thư mục</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              showModalEdit(item.ThuMucID, item.ThuMucChaID);
              setOpenMenuKey(null); // Đóng menu khi một mục được nhấp
            }}
          >
            <span>Sửa</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              deleteData(item.ThuMucID);
              setOpenMenuKey(null); // Đóng menu khi một mục được nhấp
            }}
            disabled={ListNguoiDung !== 18} // Thêm điều kiện để disabled khi ListNguoiDung === 18
          >
            <span>Xóa</span>
          </Menu.Item>
        </Menu>
      );

      // Kiểm tra xem menu có nên mở không và thêm className tương ứng
      let titleClassName = isMenuOpen ? "title-tree open-menu" : "title-tree";
      let switcherIcon;
      if (item.ThuMucID === 1) {
        switcherIcon = <HomeOutlined />;
      } else {
        switcherIcon = isExpanded ? <FolderOpenOutlined /> : <FolderOutlined />;
      }
      let title = (
        <div>
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
            trigger={["contextMenu"]}
            // visible={isMenuOpen} // Đặt visible của Dropdown
            onVisibleChange={(visible) => {
              if (visible) {
                setOpenMenuKey(item.ThuMucID); // Mở menu khi dropdown mở
              } else {
                setOpenMenuKey(null); // Đóng menu khi dropdown đóng
              }
            }}
          >
            <span className={titleClassName}>{item.TenThuMuc}</span>
          </Dropdown>
        </div>
      );

      if (item.Children) {
        return (
          <TreeNode
            switcherIcon={switcherIcon}
            title={title}
            key={item.ThuMucID}
            // isLeaf={item.isLeaf}
            Children={item.Children}
            dataRef={item}
            defaultExpandAll
          >
            {renderTreeNodes(item.Children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={title}
          switcherIcon={switcherIcon}
          key={item.ThuMucID}
          // isLeaf={item.isLeaf}
          Children={item.Children}
          dataRef={item}
          defaultExpandAll
        />
      );
    });
  const [checked, setChecked] = useState(false);
  const onSelectTreeNode = (selectedKeys, info) => {
    // Lấy ThuMucID từ dataRef của nút đã chọn
    const selectedNode = info.node.props.dataRef;
    if (selectedNode) {
      // Lưu ThuMucID vào filterData để cập nhật lại giá trị cho InputSearch
      const newFilterData = { ...filterData, ThuMucID: selectedNode.ThuMucID };
      setFilterData(newFilterData);
      setFilterData1(selectedNode.TenThuMuc);
      // Gọi hàm onFilter để áp dụng bộ lọc mới
      onFilter(selectedNode.ThuMucID, "ThuMucID");
    }
    setChecked(false);
  };
  const renderContent = () => {
    if (DanhSachThuMuc?.length) {
      return (
        <Tree
          filterTreeNode={(treeNode) => treeNode.props.dataRef.Highlight === 1}
          onSelect={onSelectTreeNode}
          onExpand={onExpandNode}
          multiple
          expandedKeys={filterData.Keyword ? props.expandedKeys : expandedKeys}
        >
          {renderTreeNodes(DSFilter)}
        </Tree>
      );
    } else {
      return <EmptyTable loading={props.TableLoading} />;
    }
  };
  const [actionmedia, setActionMedia] = useState("");
  const [visibleModalAddEditMedia, setVisibleModalAddEditMedia] =
    useState(false);
  const [confirmLoadingMedia, setConfirmLoadingMedia] = useState(false);
  const [modalKeyMedia, inceaseModalKeyMedia] = useKey();
  const showModalAddMedia = () => {
    setActionMedia("add");
    setVisibleModalAddEditMedia(true);
    inceaseModalKeyMedia();
  };
  const hideModalAddEdit = () => {
    setVisibleModalAddEditMedia(false);
  };
  const [Status, setStatus] = useState([]);
  const submitModalAddEdit = (data, filesData) => {
    setConfirmLoadingMedia(true);
    if (actionmedia === "add") {
      const formSave = new FormData();

      // Append each file to formData
      filesData.forEach((file) => {
        formSave.append("files", file);
      });

      // Create filesInfo array with corresponding data for each file
      const filesInfo = data.map((file) => ({
        TenFile: file.TenFile,
        Loai: file.Loai,
        ThoiLuongTrinhChieu: file.ThoiLuongTrinhChieu,
        KichThuoc: file.KichThuoc,
        TrangThai: file.TrangThai,
        Tag: file.Tag,
        ThuMucID: file.ThuMucID,
      }));
      console.log("filesInfo", filesInfo);

      // Append each fileInfo as a separate entry
      filesInfo.forEach((fileInfo) => {
        formSave.append("filesInfo", JSON.stringify(fileInfo));
      });

      formDataCaller(apiUrl.themmedia, formSave)
        .then((response) => {
          setConfirmLoadingMedia(false);
          if (response.data.Status > 0) {
            setStatus(response.data.Status);
            message.success(response.data.Message);
            dispatch(actions.getInitData()); //get list
            hideModalAddEdit(); // Close modal after successful upload
          } else {
            message.destroy();
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          setConfirmLoadingMedia(false);
          message.destroy();
          message.error(error.toString());
        });
    }
  };
  //paging info
  const PageNumber = filterData.PageNumber
    ? parseInt(filterData.PageNumber)
    : 1;
  const PageSize = filterData.PageSize
    ? parseInt(filterData.PageSize)
    : getDefaultPageSize();
  const onTableChange = (pagination, filters, sorter) => {
    let oldFilterData = filterData;
    let onOrder = { pagination, filters, sorter };
    let newFilterData = getFilterData(oldFilterData, null, onOrder);

    setFilterData(newFilterData);
    setSelectedRowsKey([]);
  };
  const onTableChange1 = (PageNumber, PageSize) => {
    setFilterData({
      ...filterData,
      PageNumber: PageNumber,
      PageSize: PageSize,
    });
  };
  const [visibleModalEdit, setVisibleModalEdit] = useState(false);
  const [actionedit, setActionEdit] = useState("");
  const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
  const [modalKeyEdit, inceaseModalKeyEdit] = useKey();
  const [dataModalEdit, setDataModalEdit] = useState({});

  const hideModalEditEdit = () => {
    setVisibleModalEdit(false);
  };
  const submitModalEditEdit = (data) => {
    setConfirmLoadingEdit(true);
    if (actionedit === "editedit") {
      api
        .Sua(data)
        .then((res) => {
          if (res.data.Status > 0) {
            setConfirmLoadingEdit(false);
            message.destroy();
            message.success(res.data.Message);
            hideModalEditEdit();
            props.getList(filterData);
          } else {
            setConfirmLoadingEdit(false);
            message.destroy();
            message.error(res.data.Message);
          }
        })
        .catch((error) => {
          setConfirmLoadingEdit(false);
          message.destroy();
          message.error(error.toString());
        });
    }
  };
  const showModalEditEdit = (id) => {
    const ID = id;
    setActionEdit("editedit");
    api
      .ChiTiet({ ID })
      .then((res) => {
        if (res.data.Status > 0) {
          setDataModalEdit(res.data.Data);
          inceaseModalKeyEdit();
          setVisibleModalEdit(true);
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
  const deleteModalAddEdit = (ID) => {
    Modal.confirm({
      title: "Xóa Dữ Liệu",
      content: "Bạn có muốn xóa media này không?",
      cancelText: "Không",
      okText: "Có",
      onOk: () => {
        setConfirmLoadingEdit(true);
        api
          .Xoa(ID, {})
          .then((res) => {
            if (res.data.Status > 0) {
              setConfirmLoadingEdit(false);
              props.getList(filterData);
              message.destroy();
              message.success(res.data.Message);
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
  return (
    <LayoutWrapper>
      <PageWrap>
        <PageAction>
          <Button type="primary" onClick={showModalAddMedia}>
            <PlusOutlined />
            Thêm mới
          </Button>
        </PageAction>
      </PageWrap>
      <Box>
        <BoxFilter>
          <Select
            style={{
              fontSize: "16px",
              width: 200,
            }}
            value={checked ? "all" : filterData1 || undefined}
            allowClear={false}
            showSearch={false}
            onChange={(value) => {
              if (value === "all") {
                setChecked(true);
                onFilter(null, "ThuMucID");
              } else {
                setChecked(false);
                onFilter(value, "ThuMucID");
              }
            }}
            placeholder="Chọn thư mục"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div
                  key={treeKey}
                  style={{
                    userSelect: "none",
                    overflow: "auto",
                    maxHeight: "400px",
                    padding: "8px",
                    borderTop: "1px solid #e8e8e8",
                  }}
                >
                  {renderContent()}
                </div>
              </div>
            )}
          >
            <Option value="all">Tất cả thư mục</Option>
          </Select>
          <Select
            // defaultValue={filterData.Loai ? filterData.Loai : null}
            placeholder="Loại"
            onChange={(value) => onFilter(value, "Loai")}
            style={{ width: 200 }}
            allowClear
          >
            <Option value={1}>Hình ảnh</Option>
            <Option value={2}>Video</Option>
            <Option value={3}>PDF</Option>
            <Option value={4}>PowerPoint</Option>
          </Select>
          <Select
            // defaultValue={filterData.Status ? filterData.Status : null}
            placeholder="Trạng thái"
            onChange={(value) => onFilter(value, "Status")}
            style={{ width: 200 }}
          >
            <Option value={true}>Đang sử dụng</Option>
            <Option value={false}>Không sử dụng</Option>
          </Select>
          <InputSearch
            allowClear
            defaultValue={filterData.Keyword}
            placeholder="Tìm kiếm theo tên "
            onSearch={(value) => onFilter(value, "Keyword")}
            style={{ width: 300 }}
          />
        </BoxFilter>
        {isAdmin ? (
          <div style={{ padding: "10px 0" }}>
            <BoxTable
              columns={columns}
              dataSource={DanhSachMedia || []}
              pagination={{
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Từ ${range[0]} đến ${range[1]} trên ${total} kết quả`,
                total: TotalRow,
                current: PageNumber,
                pageSize: PageSize,
                onChange: onTableChange1,
              }}
              rowKey="ID"
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "50px",
              padding: "20px 0",
            }}
          >
            {DanhSachMedia &&
              DanhSachMedia.map((item, index) => (
                <div
                  key={item.ID}
                  className="media-card"
                  style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    width: "320px",
                    transition: "all 0.3s ease",
                    background: "#fff",
                    ":hover": {
                      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      transform: "translateY(-5px)",
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0,0,0,0.15)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.09)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "180px",
                      background: "#f5f5f5",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.Loai === 1 ? (
                        <img
                          src={item.UrlFile}
                          alt={item.TenFile}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : item.Loai === 2 ? (
                        <video
                          src={item.UrlFile}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          controls
                        />
                      ) : item.Loai === 3 ? (
                        <iframe
                          src={item.UrlFile}
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                          }}
                          title={item.TenFile}
                        />
                      ) : item.Loai === 4 ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "60px", color: "#ff6b35" }}>📊</div>
                            <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>PowerPoint</div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    >
                      {item.Loai === 1 ? "Hình ảnh" : item.Loai === 2 ? "Video" : item.Loai === 3 ? "PDF" : item.Loai === 4 ? "PowerPoint" : "Unknown"}
                    </div>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.TenFile}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "8px",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "14px", color: "#8c8c8c" }}>
                          {item.KichThuoc}
                        </span>
                      </div>

                      <div
                        style={{
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: item.TrangThai ? "#e6f7ff" : "#f5f5f5",
                          color: item.TrangThai ? "#1890ff" : "#8c8c8c",
                          fontSize: "12px",
                        }}
                      >
                        {item.TrangThai ? "Đang sử dụng" : "Không sử dụng"}
                      </div>
                    </div>
                    {item.ListTag && item.ListTag.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {item.ListTag.map((tag, index) => (
                          <span
                            key={`tag-${index}-${tag}`}
                            style={{
                              padding: "2px 8px",
                              background: "rgb(242, 242, 242)",
                              borderRadius: "10px",
                              fontSize: "12px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >
                      <Tooltip color="#1890ff" title="Sửa">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            fontSize: "25px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            color: "rgba(0, 0, 0, 0.65)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1890ff";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "rgba(0, 0, 0, 0.65)";
                          }}
                          onClick={() => showModalEditEdit(item.ID)}
                        >
                          <i className="fas fa-edit" />
                        </div>
                      </Tooltip>
                      <Tooltip color="#ff4d4f" title={"Xóa"}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            fontSize: "25px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            color: "rgba(0, 0, 0, 0.65)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ff4d4f";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "rgba(0, 0, 0, 0.65)";
                          }}
                          onClick={() => deleteModalAddEdit(item.ID)}
                        >
                          <i className="fas fa-trash" />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Pagination only for Grid View if not Admin, or common? 
            Admin has pagination inside BoxTable. 
            Grid view has separate pagination.
            We need to hide grid pagination if Admin.
        */}
        {!isAdmin && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Pagination
              total={TotalRow}
              showSizeChanger
              pageSize={PageSize}
              current={PageNumber}
              onChange={onTableChange1}
              showTotal={(total, range) =>
                `Từ ${range[0]} đến ${range[1]} trên ${total} kết quả`
              }
            />
          </div>
        )}

      </Box>
      <ModalEdit
        confirmLoading={confirmLoading}
        visible={visibleModalAddEdit}
        onCancel={hideModalEdit}
        onCreate={submitModalEdit}
        dataModalEdit={dataModalAddEdit}
        key={modalKey}
        DanhSachMedia={DanhSachMedia}
        action={action}
      />
      <ModalAddEditMedia
        visible={visibleModalAddEditMedia}
        action={actionmedia}
        onCancel={hideModalAddEdit}
        onCreate={submitModalAddEdit}
        key={modalKeyMedia}
        loading={confirmLoading}
        DanhSachThuMuc={DanhSachThuMuc}
        DanhSachCoQuan={DanhSachCoQuan}
        onSearch={onSearch}
        Statuss={Status}
        setStatuss={setStatus}
      />
      <ModalEditEdit
        visible={visibleModalEdit}
        action={actionedit}
        onCancel={hideModalEditEdit}
        onCreate={submitModalEditEdit}
        key={modalKeyEdit}
        loading={confirmLoading}
        dataModalEdit={dataModalEdit}
        DanhSachThuMuc={DanhSachThuMuc}
      />
    </LayoutWrapper>
  );
};

function mapStateToProps(state) {
  return {
    ...state.DMChiTieu,
  };
}

export default connect(mapStateToProps, actions)(DMChiTieu);

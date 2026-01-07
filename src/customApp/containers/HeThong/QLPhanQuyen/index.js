import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import actions from "../../../redux/HeThong/QLPhanQuyen/actions";
import api from "./config";
import lodash from "lodash";
import LayoutWrapper from "../../../../components/utility/layoutWrapper";
import PageHeader from "../../../../components/utility/pageHeader";
import PageAction from "../../../../components/utility/pageAction";
import Box from "../../../../components/utility/box";
import BoxFilter from "../../../../components/utility/boxFilter";
import BoxTable, { EmptyTable } from "../../../../components/utility/boxTable";
import { BoxTableDiv } from "./boxTableDiv.style";

import { ModalAddEditGroup } from "./modalAddEditGroup";
import { ModalAddUser } from "./modalAddUser";
import { ModalAddPermission } from "./modalAddPermission";
import { BoxConfig } from "./boxConfig.style.js";
import { Modal, message, Row, Col, Checkbox, Tooltip } from "antd";
import {
  Select,
  Option,
  Button,
  InputSearch,
} from "../../../../components/uielements/exportComponent";
import {
  changeUrlFilter,
  getDefaultPageSize,
  getFilterData,
  getRoleByKey,
} from "../../../../helpers/utility";
import {
  UsergroupAddOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { useKey } from "../../../CustomHook/useKey";
import { useVisible } from "../../../CustomHook/useVisible";
import PageWrap from "../../../../components/utility/PageWrap.js";
// import ListSideBar from '../../../sidebar'

const QLPhanQuyen = (props) => {
  document.title = "Phân quyền";
  const dispatch = useDispatch();

  const [filterData, setFilterData] = useState(
    queryString.parse(props.location.search)
  );
  const { role } = props;
  const [loading, setLoading] = useState(false);
  const [modalKey, setModalKey] = useKey();
  const [
    visibleModalAddEditGroup,
    showModalAddEditGroup,
    hideModalAddEditGroup,
  ] = useVisible();
  const [dataEdit, setDataEdit] = useState({});
  const [DanhSachChucNangNhom, setDanhSachChucNangNhom] = useState([]);
  const [visibleConfigGroup, showConfigGroup, hideConfigGroup] = useVisible();
  const [configKey, setConfigKey] = useKey();
  const [configData, setConfigData] = useState(null);
  const [dataModalAddUser, setDataModalAddUser] = useState({
    NhomNguoiDungID: 0,
    DanhSachNguoiDung: [],
  });
  const [visibleModalAddUser, showModalAddUser, hideModalAddUser] =
    useVisible();
  const [permissionsChanged, setPermissionsChanged] = useState([]);
  const [dataModalAddPermission, setDataModalAddPermission] = useState({
    NhomNguoiDungID: 0,
    DanhSachChucNang: [],
  });
  const [
    visibleModalAddPermission,
    showModalAddPermission,
    hideModalAddPermission,
  ] = useVisible();
  const [action, setAction] = useState("add");
  const [NhomNguoiDungSelect, setNhomNguoiDungSelect] = useState(0);
  //
  const { ListSideBar } = useSelector((state) => state.ListSideBar);
  const DanhSachMenu = ListSideBar;
  const { DanhSachNhom, TotalRow, DanhSachCanBo, TableLoading } = useSelector(
    (state) => state.QLPhanQuyen
  );

  useEffect(() => {
    dispatch(actions.getInitData());
  }, []);

  useEffect(() => {
    changeUrlFilter(filterData);
    dispatch(actions.getList(filterData));
  }, [filterData]);

  const onSearch = (value, property) => {
    let onFilter = { value, property };
    let newFilterData = getFilterData(filterData, onFilter, null);
    setFilterData(newFilterData);
  };

  const onTableChange = (pagination, filters, sorter) => {
    let onOrder = { pagination, filters, sorter };
    let newFilterData = getFilterData(filterData, null, onOrder);
    setFilterData(newFilterData);
  };

  const deleteGroup = (NhomNguoiDungID) => {
    Modal.confirm({
      title: "Xóa dữ liệu",
      content: "Bạn có muốn xóa nhóm người dùng này không?",
      cancelText: "Không",
      okText: "Có",
      onOk: () => {
        api
          .xoaNhom({ NhomNguoiDungID })
          .then((response) => {
            if (response.data.Status > 0) {
              //message success
              message.success("Xóa thành công");
              //reset page
              dispatch(actions.getList(filterData));
              resetConfig("close");
            } else {
              message.destroy();
              message.error(response.data.Message);
            }
          })
          .catch((error) => {
            message.destroy();
            message.error(error.toString());
          });
      },
    });
  };

  const openModalAddEditGroup = () => {
    showModalAddEditGroup();
    setDataEdit({});
    setAction("add");
    setModalKey();
  };

  const showModalEditGroup = (NhomNguoiDungID) => {
    api
      .chiTietNhom({ NhomNguoiDungID })
      .then((response) => {
        if (response.data.Status > 0) {
          setDataEdit(response.data.Data);
          showModalAddEditGroup();
          setAction("edit");
          setModalKey();
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        message.destroy();
        message.error(error.toString());
      });
  };

  const submitModalAddEditGroup = (value) => {
    delete value.applyType;
    setLoading(true);
    if (action === "add") {
      delete value.NhomNguoiDungID;
      api
        .themNhom(value)
        .then((response) => {
          setLoading(false);
          if (response.data.Status > 0) {
            //message success
            message.success("Thêm thành công");
            //hide modal
            hideModalAddEditGroup();
            //reset page
            dispatch(actions.getList(filterData));
          } else {
            message.destroy();
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          message.destroy();
          message.error(error.toString());
        });
    } else if (action === "edit") {
      api
        .suaNhom(value)
        .then((response) => {
          setLoading(false);
          if (response.data.Status > 0) {
            //message success
            message.success("Cập nhật thành công");
            //hide modal
            hideModalAddEditGroup();
            //reset page
            dispatch(actions.getList(filterData));
          } else {
            message.destroy();
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          setLoading(false);
          message.destroy();
          message.error(error.toString());
        });
    }
  };

  const deleteUser = (param) => {
    Modal.confirm({
      title: "Xóa dữ liệu",
      content: "Bạn có muốn xóa người dùng này ra khỏi nhóm?",
      cancelText: "Không",
      okText: "Có",
      onOk: () => {
        api
          .xoaNguoiDung(param)
          .then((response) => {
            if (response.data.Status > 0) {
              //message success
              message.success("Xóa thành công");
              //reset configData
              resetConfig("open");
            } else {
              message.destroy();
              message.error(response.data.Message);
            }
          })
          .catch((error) => {
            message.destroy();
            message.error(error.toString());
          });
      },
    });
  };

  const openModalAddUser = () => {
    if (NhomNguoiDungSelect) {
      api
        .danhSachNguoiDung({ NhomNguoiDungID: NhomNguoiDungSelect })
        .then((response) => {
          if (response.data.Status > 0) {
            showModalAddUser();
            setDataModalAddUser({
              NhomNguoiDungID: NhomNguoiDungSelect,
              DanhSachNguoiDung: response.data.Data,
            });
            setModalKey();
          } else {
            message.destroy();
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          message.destroy();
          message.error(error.toString());
        });
    }
  };

  const closeModalAddUser = () => {
    hideModalAddUser();
    setDataModalAddUser({ NhomNguoiDungID: 0, DanhSachNguoiDung: [] });
  };

  const submitModalAddUser = (data) => {
    const DanhSachNguoiDungID = data.NguoiDungID;
    delete data.NguoiDungID;
    setLoading(true);
    api
      .themNhieuNguoiDung({ ...data, DanhSachNguoiDungID })
      .then((response) => {
        setLoading(false);
        if (response.data.Status > 0) {
          //message success
          message.success("Thêm thành công");
          //hide modal
          closeModalAddUser();
          //reset configData
          resetConfig("open");
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.destroy();
        message.error(error.toString());
      });
  };

  const onChangePermission = (checkedValues, PhanQuyenID) => {
    //(lodash.isEqual(obj1, obj2));
    const Data = { ...configData };
    //get newPermission
    let newPermission = {
      PhanQuyenID: parseInt(PhanQuyenID),
      Xem: 0,
      Them: 0,
      Sua: 0,
      Xoa: 0,
    };
    let oldPermission = {};
    checkedValues.forEach((item) => {
      newPermission[item] = 1;
    });
    //get oldPermission
    Data.DanhSachChucNang.some((item) => {
      if (item.PhanQuyenID === PhanQuyenID) {
        oldPermission = {
          PhanQuyenID: parseInt(item.PhanQuyenID),
          Xem: parseInt(item.Xem),
          Them: parseInt(item.Them),
          Sua: parseInt(item.Sua),
          Xoa: parseInt(item.Xoa),
        };
        return true;
      }
      return false;
    });
    let newPermissionsChanged = [...permissionsChanged];
    newPermissionsChanged.some((item, index) => {
      if (item.PhanQuyenID === newPermission.PhanQuyenID) {
        newPermissionsChanged.splice(index, 1);
        return true;
      }
      return false;
    });
    if (!lodash.isEqual(newPermission, oldPermission)) {
      newPermissionsChanged.push(newPermission);
    }
    setPermissionsChanged(newPermissionsChanged);
  };

  const savePermissionsChanged = () => {
    const paramArray = permissionsChanged;
    if (paramArray && paramArray.length) {
      Modal.confirm({
        title: "Lưu thay đổi",
        content: "Bạn có muốn cập nhật thay đổi không?",
        cancelText: "Không",
        okText: "Có",
        onOk: () => {
          api
            .suaChucNang(paramArray)
            .then((response) => {
              if (response.data.Status > 0) {
                //message success
                message.success("Cập nhật thành công");
                setPermissionsChanged([]);
                resetConfig("open");
              } else {
                message.destroy();
                message.error(response.data.Message);
              }
            })
            .catch((error) => {
              message.destroy();
              message.error(error.toString());
            });
        },
        onCancel: () => {
          setPermissionsChanged([]);
          resetConfig("open");
        },
      });
    }
  };

  const renderBoxConfig = () => {
    if (configData && visibleConfigGroup) {
      const Data = { ...configData };
      if (Data) {
        return (
          <div key={configKey}>
            <BoxConfig>
              <button
                className="closeButton"
                onClick={() => resetConfig("close")}
              >
                ✖
              </button>
              <Row gutter={8}>
                <Col lg={12} md={24}>
                  <Box className="box_class">
                    <h3>Thêm người dùng</h3>
                    <div className="action_class">
                      {role.add ? (
                        <Button type="primary" onClick={openModalAddUser}>
                          <UsergroupAddOutlined /> Thêm người dùng
                        </Button>
                      ) : (
                        ""
                      )}
                      <ModalAddUser
                        loading={loading}
                        visible={visibleModalAddUser}
                        dataModalAddUser={dataModalAddUser}
                        onCancel={closeModalAddUser}
                        onCreate={submitModalAddUser}
                        key={`user_${modalKey}`}
                        NhomNguoiDungID={NhomNguoiDungSelect}
                      />
                    </div>
                    <div className="content_class">
                      {Data.DanhSachNguoiDung &&
                        Data.DanhSachNguoiDung.length ? (
                        <div className={"ul"}>
                          {Data.DanhSachNguoiDung.map((item) => (
                            <div key={item.NguoiDungID} className={"li"}>
                              <button
                                onClick={() =>
                                  deleteUser({
                                    NhomNguoiDungID: Data.NhomNguoiDungID,
                                    NguoiDungID: item.NguoiDungID,
                                  })
                                }
                              >
                                ✖
                              </button>
                              {item.TenNguoiDung}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyTable
                          style={{ width: "100%", border: "none" }}
                          scroll={{}}
                        />
                      )}
                    </div>
                  </Box>
                </Col>
                <Col lg={12} md={24}>
                  <Box className="box_class">
                    <h3>Thêm chức năng</h3>
                    <div className="action_class">
                      {role.edit ? (
                        <Button
                          type="primary"
                          disabled={!permissionsChanged.length}
                          onClick={savePermissionsChanged}
                        >
                          <SaveOutlined /> Lưu
                        </Button>
                      ) : (
                        ""
                      )}
                      {role.edit ? (
                        <Button type="primary" onClick={openModalAddPermission}>
                          <FileAddOutlined /> Thêm chức năng
                        </Button>
                      ) : (
                        ""
                      )}
                      <ModalAddPermission
                        loading={loading}
                        visible={visibleModalAddPermission}
                        dataModalAddPermission={dataModalAddPermission}
                        onCancel={closeModalAddPermission}
                        onCreate={submitModalAddPermission}
                        key={`permission_${modalKey}`}
                      />
                    </div>
                    <div className="content_class">
                      {renderOptions(Data.DanhSachChucNang)}
                    </div>
                  </Box>
                </Col>
              </Row>
            </BoxConfig>
          </div>
        );
      }
    }
    return null;
  };

  const renderOptions = (DanhSachChucNang) => {
    let DanhSachNhomChucNang = [];
    let optionsComponent = <EmptyTable scroll={{}} />;
    if (DanhSachChucNang && DanhSachChucNang.length) {
      // optionsSidebar.forEach(group => {
      //   if (group.children) {
      //     let childrenKeys = group.children.map((children) => children.key);
      //     DanhSachChucNang.some((option) => {
      //       if (childrenKeys.indexOf(option.MaChucNang) >= 0) {
      //         DanhSachNhomChucNang.push({
      //           label: group.label,
      //           childrenKeys,
      //           isParent: true,
      //         });
      //         return true;
      //       }
      //       return false;
      //     });
      //   } else {
      //     DanhSachChucNang.some((option) => {
      //       //danh sach chuc nang cha
      //       if (group.key === option.MaChucNang) {
      //         DanhSachNhomChucNang.push({
      //           key: group.key,
      //           label: group.label,
      //           isParent: option.ChucNangChaID > 0,
      //         });
      //         return true;
      //       }
      //       return false;
      //     });
      //   }
      // });

      DanhSachMenu.forEach((menu) => {
        if (menu.Children && menu.Children.length) {
          menu.Children.some((menuChild) => {
            if (
              DanhSachChucNang.find(
                (chucnang) =>
                  chucnang.MaChucNang === menuChild.MaMenu && menuChild.HienThi
              )
            ) {
              DanhSachNhomChucNang.push({
                key: menu.MaMenu,
                label: menu.TenMenu,
                children: menu.Children,
                isParent: true,
              });
              return true;
            }
            return false;
          });
        } else {
          if (menu.HienThi) {
            DanhSachChucNang.some((option) => {
              //danh sach chuc nang cha
              if (menu.MaMenu === option.MaChucNang) {
                DanhSachNhomChucNang.push({
                  key: menu.MaMenu,
                  label: menu.TenMenu,
                  isParent: option.ChucNangChaID > 0,
                });
                return true;
              }
              return false;
            });
          }
        }
      });

      optionsComponent = DanhSachNhomChucNang.map((groupValue, indexParent) => {
        if (!groupValue.isParent) {
          return DanhSachChucNang.map((item, index) => {
            if (groupValue.key === item.MaChucNang) {
              let options = [
                { label: "Xem", value: "Xem", disabled: false },
                { label: "Thêm", value: "Them", disabled: false },
                { label: "Sửa", value: "Sua", disabled: false },
                { label: "Xóa", value: "Xoa", disabled: false },
              ];
              let defaultValue = [];
              if (item.Xem) defaultValue.push("Xem");
              if (item.Them) defaultValue.push("Them");
              if (item.Sua) defaultValue.push("Sua");
              if (item.Xoa) defaultValue.push("Xoa");
              return (
                <div key={item.PhanQuyenID} className="content_row">
                  <b className="tenchucnang">{item.TenChucNang}</b>
                  <div className="chonxoaquyen">
                    <Checkbox.Group
                      options={options}
                      defaultValue={defaultValue}
                      onChange={(checkedValue) =>
                        onChangePermission(checkedValue, item.PhanQuyenID)
                      }
                    />

                    <button
                      className="float-right"
                      onClick={() =>
                        deletePermission({
                          PhanQuyenID: item.PhanQuyenID,
                        })
                      }
                    >
                      ✖
                    </button>
                    <div className="clearfix" />
                  </div>
                </div>
              );
            }
          });
        } else {
          return (
            <div>
              <div>
                <b>{groupValue.label}</b>
              </div>
              {DanhSachChucNang.map((item, index) => {
                if (
                  groupValue.children &&
                  groupValue.children.find(
                    (gr) => gr.MaMenu === item.MaChucNang
                  )
                ) {
                  let options = [],
                    defaultValue = [];
                  const ChucNangID = item.ChucNangID;
                  //get parent item from all list chuc nang
                  let parentItem = null;
                  const DanhSachChucNangCha = [...DanhSachChucNangNhom];
                  DanhSachChucNangCha.some((pItem) => {
                    if (pItem.ChucNangID === ChucNangID) {
                      parentItem = { ...pItem };
                      return true;
                    }
                    return false;
                  });
                  if (parentItem) {
                    options = [
                      {
                        label: "Xem",
                        value: "Xem",
                        disabled: parentItem.Xem === 0,
                      },
                      {
                        label: "Thêm",
                        value: "Them",
                        disabled: parentItem.Them === 0,
                      },
                      {
                        label: "Sửa",
                        value: "Sua",
                        disabled: parentItem.Sua === 0,
                      },
                      {
                        label: "Xóa",
                        value: "Xoa",
                        disabled: parentItem.Xoa === 0,
                      },
                    ];
                    if (item.Xem) defaultValue.push("Xem");
                    if (item.Them) defaultValue.push("Them");
                    if (item.Sua) defaultValue.push("Sua");
                    if (item.Xoa) defaultValue.push("Xoa");
                    return (
                      <div key={item.PhanQuyenID} className="content_row">
                        <div className="tenchucnang">{item.TenChucNang}</div>
                        <div className="chonxoaquyen">
                          <Checkbox.Group
                            defaultValue={defaultValue}
                            options={options}
                            onChange={(checkedValue) =>
                              onChangePermission(checkedValue, item.PhanQuyenID)
                            }
                          />
                          <button
                            className="float-right"
                            onClick={() =>
                              deletePermission({
                                PhanQuyenID: item.PhanQuyenID,
                              })
                            }
                          >
                            ✖
                          </button>
                          <div className="clearfix" />
                        </div>
                      </div>
                    );
                  }
                }
              })}
            </div>
          );
        }
      });
    }
    return optionsComponent;
  };

  const deletePermission = (param) => {
    Modal.confirm({
      title: "Xóa dữ liệu",
      content: "Bạn có muốn xóa chức năng này ra khỏi nhóm?",
      cancelText: "Không",
      okText: "Có",
      onOk: () => {
        api
          .xoaChucNang(param)
          .then((response) => {
            if (response.data.Status > 0) {
              //message success
              message.success("Xóa thành công");
              //reset configData
              resetConfig("open");
            } else {
              message.destroy();
              message.error(response.data.Message);
            }
          })
          .catch((error) => {
            message.destroy();
            message.error(error.toString());
          });
      },
    });
  };

  const openModalAddPermission = () => {
    if (NhomNguoiDungSelect) {
      let NhomNguoiDungID = NhomNguoiDungSelect;
      let DanhSachChucNang = [];
      //danh sach chuc nang da dc sd
      const ExistList = configData.DanhSachChucNang;
      const ExistID =
        ExistList && ExistList.length
          ? ExistList.map((item) => item.ChucNangID.toString())
          : [];
      DanhSachChucNangNhom.map((item) => {
        //neu chuc nang nay chua dc sd -> disable = false
        if (ExistID.indexOf(item.ChucNangID.toString()) < 0) {
          DanhSachChucNang.push({ ...item, disabled: false });
        } else {
          DanhSachChucNang.push({ ...item, disabled: true });
        }
      });
      //set state open modal
      showModalAddPermission();
      setDataModalAddPermission({ NhomNguoiDungID, DanhSachChucNang });
      setModalKey();
    }
  };

  const closeModalAddPermission = () => {
    hideModalAddPermission();
    setDataModalAddPermission({ NhomNguoiDungID: 0, DanhSachChucNang: [] });
  };

  const submitModalAddPermission = (data) => {
    setLoading(true);
    api
      .themChucNang(data)
      .then((response) => {
        setLoading(false);
        if (response.data.Status > 0) {
          //message success
          message.success("Thêm thành công");
          //hide modal
          closeModalAddPermission();
          //reset configData
          resetConfig("open");
        } else {
          message.destroy();
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.destroy();
        message.error(error.toString());
      });
  };

  const resetConfig = (status) => {
    if (status === "open") {
      if (NhomNguoiDungSelect) {
        let NhomNguoiDungID = NhomNguoiDungSelect;
        api
          .sieuChiTietNhom({ NhomNguoiDungID })
          .then((response) => {
            if (response.data.Status > 0) {
              api.danhSachChucNang({ NhomNguoiDungID }).then((response2) => {
                showConfigGroup();
                setConfigData(response.data.Data);
                setPermissionsChanged([]);
                setDanhSachChucNangNhom(response2.data.Data);
                setConfigKey();
              });
            } else {
              message.destroy();
              message.error(response.data.Message);
            }
          })
          .catch((error) => {
            message.destroy();
            message.error(error.toString());
          });
      }
    } else {
      hideConfigGroup();
      setConfigData(null);
      setPermissionsChanged([]);
      setDanhSachChucNangNhom([]);
      setNhomNguoiDungSelect(0);
    }
  };

  const onSelectChange = (NhomNguoiDungID) => {
    if (NhomNguoiDungSelect !== NhomNguoiDungID) {
      api
        .sieuChiTietNhom({ NhomNguoiDungID })
        .then((response) => {
          if (response.data.Status > 0) {
            api.danhSachChucNang({ NhomNguoiDungID }).then((response2) => {
              showConfigGroup();
              setConfigData(response.data.Data);
              setPermissionsChanged([]);
              setDanhSachChucNangNhom(response2.data.Data);
              setNhomNguoiDungSelect(NhomNguoiDungID);
              setConfigKey();
            });
          } else {
            message.destroy();
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          message.destroy();
          message.error(error.toString());
        });
    } else {
      // setNhomNguoiDungSelect(0);
      // hideConfigGroup();
      // setDanhSachChucNangNhom([]);
    }
  };

  const renderThaoTac = (record) => {
    return (
      <div className={"action-btn"}>
        {role.edit ? (
          <Tooltip title={"Cấu hình"}>
            <SettingOutlined
              onClick={() => onSelectChange(record.NhomNguoiDungID)}
            />
          </Tooltip>
        ) : (
          ""
        )}
        {role.edit ? (
          <Tooltip title={"Sửa"}>
            <EditOutlined
              onClick={() => showModalEditGroup(record.NhomNguoiDungID)}
            />
          </Tooltip>
        ) : (
          ""
        )}
        {role.delete ? (
          <Tooltip title={"Xóa"}>
            <DeleteOutlined
              onClick={() => deleteGroup(record.NhomNguoiDungID)}
            />
          </Tooltip>
        ) : (
          ""
        )}
      </div>
    );
  };

  const PageNumber = filterData.PageNumber
    ? parseInt(filterData.PageNumber)
    : 1;
  const PageSize = filterData.PageSize
    ? parseInt(filterData.PageSize)
    : getDefaultPageSize();

  const columns = [
    {
      title: "STT",
      align: "center",
      width: 5,
      render: (text, record, index) =>
        record.NhomNguoiDungID === NhomNguoiDungSelect ? (
          <b>{(PageNumber - 1) * PageSize + (index + 1)}</b>
        ) : (
          (PageNumber - 1) * PageSize + (index + 1)
        ),
    },
    {
      title: "Tên nhóm người dùng",
      dataIndex: "TenNhom",
      width: 50,
      render: (text, record) =>
        record.NhomNguoiDungID === NhomNguoiDungSelect ? <b>{text}</b> : text,
    },
    {
      title: "Ghi chú",
      dataIndex: "GhiChu",
      width: 30,
      render: (text) => <span className={"text-area-content"}>{text}</span>,
    },
    {
      title: "Thao tác",
      width: 15,
      align: "center",
      render: (text, record) => renderThaoTac(record),
    },
  ];

  return (
    <LayoutWrapper>
      <PageWrap>
        {/* <PageHeader>QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</PageHeader> */}
        <PageAction>
          {role.add ? (
            <Button type="primary" onClick={openModalAddEditGroup}>
              <UsergroupAddOutlined /> Thêm
            </Button>
          ) : (
            ""
          )}
        </PageAction>
      </PageWrap>
      <Box>
        <BoxFilter>
          <Select
            allowClear
            showSearch
            onChange={(value) => onSearch(value, "CanBoID")}
            value={filterData.CanBoID}
            placeholder="Chọn cán bộ"
            style={{ width: 200 }}
          >
            {DanhSachCanBo?.map((value) => (
              <Option key={value.CanBoID} value={value.CanBoID.toString()}>
                {value.TenCanBo}
              </Option>
            ))}
          </Select>
          <InputSearch
            allowClear
            defaultValue={filterData.Keyword}
            placeholder="Tìm kiếm theo tên nhóm người dùng"
            onSearch={(value) => onSearch(value, "Keyword")}
            style={{ width: 300 }}
          />
        </BoxFilter>
        <BoxTableDiv>
          {renderBoxConfig()}
          <BoxTable
            columns={columns}
            rowKey="NhomNguoiDungID"
            dataSource={DanhSachNhom}
            loading={TableLoading || loading}
            onChange={onTableChange}
            pagination={{
              showSizeChanger: true, //show text: PageSize/page
              showTotal: (total, range) =>
                `Từ ${range[0]} đến ${range[1]} trên ${total} kết quả`,
              total: TotalRow,
              current: PageNumber, //current page
              pageSize: PageSize,
            }}
          />
        </BoxTableDiv>
        <ModalAddEditGroup
          loading={loading}
          visible={visibleModalAddEditGroup}
          onCancel={hideModalAddEditGroup}
          onCreate={submitModalAddEditGroup}
          key={`group_${modalKey}`}
          dataEdit={dataEdit}
        />
      </Box>
    </LayoutWrapper>
  );
};

export default QLPhanQuyen;

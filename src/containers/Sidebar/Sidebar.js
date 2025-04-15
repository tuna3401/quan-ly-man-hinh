import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import clone from "clone";
import { Link } from "react-router-dom";
import { Layout, Tooltip } from "antd";
import Menu from "../../components/uielements/menu";
import SidebarWrapper from "./sidebar.style";
import appActions from "../../redux/app/actions";
import actionSidebar from "../../customApp/redux/HeThong/Sidebar/actions";
import { store } from "../../redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Go from "./go.png";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
const { Item } = Menu;
const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
  checkKeKhai,
  changeListChild,
  changeMaMenuActive,
} = appActions;
import { getInfoFromToken } from "../../helpers/utility";
import { createTreeSidebar, getLocalKey } from "../../helpers/utility";

const stripTrailingSlash = (str) => {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
};

const Sidebar = (props) => {
  const [width, setWidth] = useState(0);
  // const {ListSideBar} = useSelector((state) => state.ListSideBar);
  const access_token = getLocalKey("access_token");
  const dataUnzip = getInfoFromToken(access_token);
  const ListChucNang = dataUnzip?.ChucNang;

  const ListChucNangCha = [];
  ListChucNang?.forEach((item) => {
    if (
      !ListChucNangCha.find(
        (ChucNangCha) => ChucNangCha.ChucNangID === item.ChucNangChaID
      )
    ) {
      ListChucNangCha.push({
        TenChucNang: item.TenChucNangCha,
        ChucNangID: item.ChucNangChaID,
        ChucNangChaID: 0,
      });
    }
  });
  let ListSideBar;
  if (ListChucNang) {
    ListSideBar = createTreeSidebar([...ListChucNang, ...ListChucNangCha]);
  }
  const [MaRedirect, setMaRedirect] = useState();
  const history = useHistory();
  const { ListChild } = props;

  useEffect(() => {
    props.checkKeKhai();
    setWidth(window.innerWidth);
    window.addEventListener("resize", (e) => {
      setWidth(e.target.innerWidth);
    });
  }, []);

  const handleClick = (e) => {
    props.changeCurrent([e.key]);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    // props.checkKeKhai();
    // dispatch(actionSidebar.getList());
  }, []);

  const { app } = props;

  const onOpenChange = (newOpenKeys) => {
    const { app, changeOpenKeys } = props;
    const latestOpenKey = newOpenKeys.find(
      (key) => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      (key) => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  };

  const getAncestorKeys = (key) => {
    const map = {
      sub3: ["sub2"],
    };
    return map[key] || [];
  };

  const getMenuItem = ({ singleOption, submenuStyle, submenuColor }) => {
    const { TenChucNang, Icon, Children, HienThi, MaChucNang } = singleOption;
    const checkBaoCao = MaChucNang?.includes("bao-cao");
    const url = stripTrailingSlash(props.url);

    if (Children && Children.length > 0) {
      return (
        <SubMenu
          key={MaChucNang}
          className="parent-menu__item"
          data_key={MaChucNang}
          title={
            <span className="isoMenuHolder" data_key={MaChucNang}>
              <div className="wrapper-content__item">
                {/* <img src={Icon} /> */}
                <span className="nav-text" style={{ padding: "20px 10px" }}>
                  {TenChucNang}
                </span>
              </div>
            </span>
          }
          popupClassName={
            Children.length > 2
              ? "menu-topbar popupSubMenuInline"
              : Children.length === 2
              ? "menu-topbar_SubMenuInline popupSubMenuInline"
              : "popupSubMenuInline"
          }
        >
          {Children.map((child, indexChild) => {
            const linkTo = `${url}/${child.MaChucNang}`;
            if (child.HienThi) {
              return !checkBaoCao ? (
                <Item key={child.MaChucNang} data_key={MaChucNang}>
                  <Link
                    key={child.MaChucNang}
                    to={`${url}/${child.MaChucNang}`}
                    class="parent nav-text"
                    onClick={() => {
                      localStorage.setItem("TenChucNang", child.TenChucNang);
                    }}
                  >
                    {child.TenChucNang}
                  </Link>
                </Item>
              ) : (
                <Item key={child.MaChucNang} data_key={MaChucNang}>
                  <Tooltip title={child.TenChucNang}>
                    <Link
                      key={child.MaChucNang}
                      to={`${url}/${child.MaChucNang}`}
                      class="parent nav-text"
                    >
                      {child.TenChucNang}
                    </Link>
                  </Tooltip>
                </Item>
              );
            }
          })}
        </SubMenu>
      );
    }
    return (
      <Item key={MaChucNang}>
        <Link key={MaChucNang} to={`${url}/${MaChucNang}`}>
          <span className="isoMenuHolder" style={submenuColor}>
            <ion-icon name={Icon} />
            <span className="nav-text">{TenChucNang}</span>
          </span>
        </Link>
      </Item>
    );
  };

  const getListOption = (optionsUsing) => {
    let role = store.getState().Auth.role;
    if (!role) {
      let roleStore = localStorage.getItem("role");
      role = JSON.parse(roleStore);
    }
    let user = store.getState().Auth.user;
    if (!user) {
      let userStore = localStorage.getItem("user");
      user = JSON.parse(userStore);
    }
    const isAdmin = user?.NguoiDungID === 1;
    let listOptions = [];
    optionsUsing?.forEach((menu) => {
      if (menu.Children && menu.Children.length) {
        let Children = [];
        menu.Children.forEach((menuChild) => {
          //if menuChild has permission
          // if ((role && role[menuChild.key] && role[menuChild.key].view) && menuChild.showMenu || menuChild.noRole) {
          if (isAdmin) {
            if (menuChild.showAdmin) {
              Children.push(menuChild);
            }
          } else {
            Children.push(menuChild);
          }
          // }
        });
        if (Children.length) listOptions.push({ ...menu, Children });
      } else {
        // if ((role && role[menu.key] && role[menu.key].view) && menu.showMenu || menu.noRole) {
        if (isAdmin) {
          if (menu.showAdmin) {
            listOptions.push(menu);
          }
        } else {
          listOptions.push(menu);
        }
        // } else {
        // if (menu.key === 'ke-khai-tai-san/ke-khai') {
        //   if (CheckKeKhai.KeKhai) {
        //     if (CheckKeKhai.ThemKeKhai) {
        //       listOptions.push({...menu});
        //     } else {
        //       if (CheckKeKhai.TrangThaiBanKeKhai !== 4) {//đã gửi
        //         listOptions.push({...menu});
        //       }
        //     }
        //   }
        // }
        // }
      }
    });
    return listOptions;
  };

  const { toggleOpenDrawer, customizedTheme, height } = props;
  const collapsed = clone(app.collapsed);
  const { openDrawer } = app;
  const mode = collapsed === true ? "vertical" : "inline";
  const onMouseEnter = () => {
    if (openDrawer === false) {
      toggleOpenDrawer();
    }
  };
  const onMouseLeave = () => {
    if (openDrawer === true) {
      toggleOpenDrawer();
    }
  };

  const submenuStyle = {
    backgroundColor: "rgba(0,0,0,0.3)",
    color: customizedTheme.textColor,
  };
  const submenuColor = {
    color: customizedTheme.textColor,
  };

  //get list option ------- #################
  let role = store.getState().Auth.role;
  if (!role) {
    let roleStore = localStorage.getItem("role");
    role = JSON.parse(roleStore);
  }

  const listOptions = getListOption(ListSideBar);

  const url = stripTrailingSlash(props.url);
  useEffect(() => {
    if (MaRedirect || MaRedirect === "") {
      history.push(`${url}/${MaRedirect}`);
    }
  }, [MaRedirect]);
  const [isHovered, setIsHovered] = useState(false);
  console.log("isHovered", isHovered);
  return (
    <>
      {/* {width <= 500 ?  */}
      <SidebarWrapper
        style={{
          userSelect: "none",
          // gridTemplateColumns:
          //   ListChild && ListChild.length > 0 ? "80px 210px" : "75px",
          background: "#fff",
        }}
      >
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width={220}
          className="isomorphicSidebar"
          onMouseEnter={() => {
            onMouseEnter();
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            onMouseLeave();
            setIsHovered(false);
          }}
        >
          <div
            style={{
              height,
              maxHeight: height,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <img
              src={Go}
              alt={""}
              style={{
                width: "50px",
                height: "40px",
                display: "block",
                margin: "25px auto 20px auto",
              }}
            />

            <h2
              className={"triggerHeader"}
              // style={{ display: collapsed ? "none" : "block" }}
            >
              {!collapsed ? "Go Smart Signage" : ""}
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Menu
                onClick={handleClick}
                theme="light"
                className="isoDashboardMenu"
                mode={mode}
                openKeys={collapsed ? [] : app.openKeys}
                selectedKeys={app.current}
                onOpenChange={onOpenChange}
              >
                {listOptions.map((singleOption) =>
                  getMenuItem({ submenuStyle, submenuColor, singleOption })
                )}
              </Menu>
              <i
                className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}
                style={{
                  fontSize: "20px",
                  margin: "10px",
                  cursor: "pointer",
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  color: "#1890ff",
                }}
                onClick={() => {
                  props.toggleCollapsed();
                  props.toggleOpenDrawer();
                }}
              />
            </div>
          </div>
         
        </Sider>
        
      </SidebarWrapper>
      
    </>
  );
};

export default connect(
  (state) => ({
    ...state.App,
    app: state.App,
    customizedTheme: state.ThemeSwitcher.sidebarTheme,
    height: state.App.height,
    ListChild: state.App.ListChild,
    MaMenuActive: state.App.MaMenuActive,
  }),
  {
    toggleOpenDrawer,
    changeOpenKeys,
    changeListChild,
    changeCurrent,
    toggleCollapsed,
    checkKeKhai,
    changeMaMenuActive,
  }
)(Sidebar);

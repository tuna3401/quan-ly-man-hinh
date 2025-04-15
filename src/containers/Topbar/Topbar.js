import React, { Component, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Layout,
  Drawer,
  // , Icon,
  Spin,
  Tooltip,
  Dropdown,
  message,
} from "antd";
import appActions from "../../redux/app/actions";
import TopbarNotification from "./topbarNotification";
import actions from "../../customApp/redux/DashBoard/action";
import TopbarUser from "./topbarUser";
import TopbarWrapper from "./topbar.style";
import Dang from "../../image/dang.png";
// import apiHuongDan from '../../customApp/containers/QLHuongDanSuDung/config';
import { store } from "../../redux/store";
import Menu from "../../components/uielements/menu";
import {
  changeUrlHttps,
  checkHttps,
  getConfigLocal,
  getRoleByKey,
  getListOption,
  _debounce,
  getInfoFromToken,
  getLocalKey,
} from "../../helpers/utility";
import { siteConfig } from "../../settings";
import {
  QuestionCircleOutlined,
  MenuOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import actionSidebar from "../../customApp/redux/HeThong/Sidebar/actions";
import api from "./config";
import Switches from "../../components/uielements/switch";
// import apiKeKhai from "../../customApp/containers/KeKhaiTaiSan/config";
import MoonIcon from "../../components/utility/MoonIcon";
import SunIcon from "../../components/utility/SunIcon";
import Go from "./go.png";
const { SubMenu, Item } = Menu;
const { Header } = Layout;
const {
  toggleCollapsed,
  clearMenu,
  changeOpenKeys,
  changeCurrent,
  checkKeKhai,
  changeListMenuActive,
  changeListChild,
  changeMaMenuActive,
} = appActions;

const stripTrailingSlash = (str) => {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
};

const Topbar = (props) => {
  const [visibleDrawer, setvisibleDrawer] = useState(false);
  const [filePath, setFilePath] = useState(false);
  const [linkPath, setlinkPath] = useState(false);
  const [fileKey, setFileKey] = useState(false);
  const [validFile, setValidFile] = useState(false);
  const [loadingHuongDan, setLoadingHuongDan] = useState(false);
  const [CheckKeKhai, setCheckKeKhai] = useState(false);
  const { ListSideBar } = useSelector((state) => state.ListSideBar);
  const { SoLieuCanhBao } = useSelector((state) => state.DashBoard);
  const dispatch = useDispatch();
  console.log("document.title", document.title);
  useEffect(() => {
    // props.checkKeKhai();
    dispatch(actionSidebar.getList());
    // dispatch(actions.getSoLieuCanhBao());
  }, []);
  const tenchucnang = localStorage.getItem("TenChucNang");
  const showDrawer = () => {
    const arrayKey = current;
    let link = "";

    if (arrayKey && arrayKey.length) {
      link = arrayKey[0];
    }
    if (link === "ke-khai-tai-san/ke-khai") {
      link = "ke-khai-tai-san";
    }
    setLoadingHuongDan(true);
    api
      .GetByMaChucNang({ MaChucNang: link })
      .then((response) => {
        setLoadingHuongDan(false);
        if (response.data.Status > 0) {
          let filePath = response.data.Data.UrlFile;
          let Link = response.data.Data.Link;
          filePath = changeUrlHttps(filePath);
          //
          if (filePath && filePath.length > 0) {
            setValidFile(true);
            setFileKey(link);
            setFilePath(filePath);
            setlinkPath(Link);
          } else {
            setValidFile(false);
          }
        } else {
          setValidFile(false);
        }
      })
      .catch(() => {
        setValidFile(false);
        setLoadingHuongDan(false);
      });
    setvisibleDrawer(true);
  };

  const closeDrawer = () => {
    setvisibleDrawer(false);
    setLoadingHuongDan(true);
    setValidFile(false);
  };

  const handleClick = (e) => {
    props.changeCurrent([e.key]);
  };

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
    const { TenMenu, Icon, Children, HienThi, MaMenu } = singleOption;
    const url = stripTrailingSlash(props.url);
    if (Children) {
      return (
        <SubMenu
          key={MaMenu}
          title={
            <span className="isoMenuHolder">
              <i className={Icon} />
              <span className="nav-text">{TenMenu}</span>
            </span>
          }
          style={{ display: "flex" }}
          popupClassName={
            Children.length > 2
              ? "menu-topbar popupSubMenuInline"
              : Children.length === 2
              ? "menu-topbar_SubMenuInline popupSubMenuInline"
              : "popupSubMenuInline"
          }
        >
          {Children.map((child) => {
            const linkTo = `${url}/${child.MaMenu}`;
            if (child.HienThi) {
              return (
                <Item key={child.MaMenu} class="parent">
                  <Link to={linkTo} class="parent">
                    {child.TenMenu}
                  </Link>
                </Item>
              );
            }
          })}
        </SubMenu>
      );
    }
    return (
      <Item key={MaMenu}>
        <Link to={`${url}/${MaMenu}`}>
          <span className="isoMenuHolder" style={submenuColor}>
            <i className={Icon} />
            <span style={{ color: "#fff" }} className="nav-text">
              {TenMenu}
            </span>
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
    // role = {...role,theo-doi-tien-trinh : }
    // role[theo-doi-tien-trinh] = {view: 1, add: 1, edit: 1, delete: 1}
    if (!user) {
      let userStore = localStorage.getItem("user");
      user = JSON.parse(userStore);
    }
    const isAdmin = user ? user.NguoiDungID === 1 : false;
    let listOptions = [];
    optionsUsing?.forEach((menu) => {
      if (menu.Children && menu.Children.length) {
        let Children = [];
        menu.Children.forEach((menuChild) => {
          //if menuChild has permission
          if (
            (role &&
              role[menuChild.MaMenu] &&
              role[menuChild.MaMenu].view &&
              menuChild.HienThi) ||
            menuChild.noRole
          ) {
            if (isAdmin) {
              if (menuChild.HienThi) {
                Children.push(menuChild);
              }
            } else {
              Children.push(menuChild);
            }
          }
        });
        if (menu.Children.length) listOptions.push({ ...menu, Children });
      } else {
        if (
          (role &&
            role[menu.MaMenu] &&
            role[menu.MaMenu].view &&
            menu.HienThi) ||
          menu.noRole
        ) {
          if (isAdmin) {
            if (menu.HienThi) {
              listOptions.push(menu);
            }
          } else {
            listOptions.push(menu);
          }
        }
      }
    });
    return listOptions;
  };

  const formatTenCoQuanDangNhap = (TenCoQuan) => {
    if (TenCoQuan.length > 30) {
      const shortName = TenCoQuan.substring(0, 30);
      return <Tooltip title={TenCoQuan}>{shortName}...</Tooltip>;
    } else {
      return TenCoQuan;
    }
  };

  const handleFindParent = (list, child, obj) => {
    list.forEach((item) => {
      if (item && item.Children) {
        if (item && item.MaMenu === child) {
          obj["parent"] = item;
        } else {
          const CheckedChild = item.Children.find(
            (itemChild) => itemChild.MaMenu === child
          );
          if (CheckedChild && obj) {
            obj["parent"] = item;
          }
        }
      }
    });
  };

  const handleGetListChild = () => {
    const { app } = props;
    let parent = {};
    if (mode === "inline" && current?.length > 0) {
      handleFindParent(listOptions, current[0], parent);
    }
    const ListChild =
      parent && parent?.parent?.Children ? parent?.parent?.Children : [];
    props.changeListMenuActive(ListChild);
  };

  const { toggleCollapsed, url, locale, openKeys, current, customizedTheme } =
    props;
  const collapsed = props.collapsed && !props.openDrawer;

  const TenDonVi = getConfigLocal("tenDonVi", "");

  let htmlResult = (
    <div>
      {loadingHuongDan ? <Spin /> : "Chưa có hướng dẫn cho chức năng này"}
    </div>
  );

  let role = store.getState().Auth.role;
  if (!role) {
    let roleStore = localStorage.getItem("role");
    role = JSON.parse(roleStore);
  }
  let user = getInfoFromToken();
  const TenCoQuanDangNhap = (user && user?.NguoiDung?.TenCoQuan) || TenDonVi;
  // const optionsUsing = roleQuanLy && roleQuanLy.view ? [...options] : [...optionsCanBo];
  const listOptions = getListOption(ListSideBar);

  const SidebarWidth = document.querySelectorAll(".ant-layout-sider")[0]
    ?.clientWidth
    ? document.querySelectorAll(".ant-layout-sider")[0]?.clientWidth + 10
    : 80;

  const mode = collapsed === true ? "vertical" : "inline";
  const access_token = getLocalKey("access_token");
  const dataUnzip = getInfoFromToken(access_token);
  let ListChucNang = dataUnzip?.NguoiDung?.UrlFile;

  // if (ListChucNang) {
  //   ListChucNang = `http://displaycms.gosol.com.vn${ListChucNang}`;
  // }
  const access_token1 = getLocalKey("access_token");
  const dataUnzip1 = getInfoFromToken(access_token1);
  const TenNguoiDung = dataUnzip1?.NguoiDung?.TenNguoiDung;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <TopbarWrapper style={{ userSelect: "none" }} SidebarWidth={SidebarWidth}>
      <Header
        className={
          collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
        }
        style={{
          background: "#fff",
        }}
      >
        <div className="isoLeft">
          <MenuOutlined
            className={
              collapsed ? "triggerBtn menuCollapsed" : "triggerBtn menuOpen"
            }
            onClick={() => {
              toggleCollapsed();
              // handleGetListChild();
            }}
          />
          {/* <Link
            to={"/dashboard"}
            style={{ display: "flex", fontSize: 18,marginTop:"15px" }}
            onClick={() => {
              dispatch(props.changeListChild([]));
              dispatch(props.changeMaMenuActive(""));
              props.changeCurrent([]);
            }}
          > */}

          {width > 500 && <h1 className={"triggerHeader"}>{document.title}</h1>}
        </div>
        {/* <Menu
            onClick={handleClick}
            theme="light"
            className="isoDashboardMenu"
            mode="horizontal"
            overflowedIndicator={<p>...</p>}
            // openKeys={openKeys}
            selectedKeys={current}
            onOpenChange={onOpenChange}
          >
            {listOptions.map(singleOption =>
              getMenuItem({submenuStyle, submenuColor, singleOption})
            )}
          </Menu> */}
        {/* <p className="siteName_topbar">{siteConfig.siteName}</p> */}

        <div className="isoRight">
          <p className="isoUser">
            <TopbarUser locale={locale} />
          </p>
          {/* <p style={{ marginTop: "10px", color: "#333" }}>{TenNguoiDung}</p> */}
        </div>

        <Drawer
          className="guideDrawer"
          width="50%"
          title="Hướng dẫn"
          placement="right"
          closable={true}
          onClose={closeDrawer}
          open={visibleDrawer}
          // bodyStyle={{ height: "calc(100% - 60px)" }}
        >
          {validFile ? (
            <div style={{ textAlign: "center", height: "100%" }}>
              <p
                style={{
                  fontWeight: 500,
                  textAlign: "left",
                  margin: "10px 0",
                  fontSize: 20,
                }}
              >
                Tài liệu hướng dẫn
              </p>
              <iframe
                style={{ width: "100%", height: "100%" }}
                src={filePath}
              />
              <p
                style={{
                  fontWeight: 500,
                  textAlign: "left",
                  padding: "15px 0 15px 0",
                  // margin: '10px 0 50px 0',
                  fontSize: 20,
                  position: "fixed",
                  width: "100%",
                  bottom: 0,
                  background: "#fff",
                }}
              >
                Video hướng dẫn :{" "}
                <a href={linkPath} target="_blank">
                  <YoutubeOutlined /> Xem video
                </a>
              </p>
            </div>
          ) : (
            htmlResult
          )}
        </Drawer>
      </Header>
    </TopbarWrapper>
  );
};

export default connect(
  (state) => ({
    ...state.App,
    app: state.App,
    locale: state.LanguageSwitcher.language.locale,
    customizedTheme: state.ThemeSwitcher.topbarTheme,
  }),
  {
    toggleCollapsed,
    clearMenu,
    changeCurrent,
    changeOpenKeys,
    checkKeKhai,
    changeListMenuActive,
    changeListChild,
    changeMaMenuActive,
  }
)(Topbar);

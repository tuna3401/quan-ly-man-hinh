import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { Debounce } from "react-throttle";
import WindowResizeListener from "react-window-size-listener";
import { ThemeProvider } from "styled-components";
import authAction from "../../redux/auth/actions";
import appActions from "../../redux/app/actions";
import Sidebar from "../Sidebar/Sidebar";
import Notification from "../Notification/notification";
import Topbar from "../Topbar/Topbar";
import AppRouter from "./AppRouter";
import { siteConfig } from "../../settings";
import logo from "./go.png";
import themes from "../../settings/themes";
import AppHolder from "./commonStyle";
import GlobalStyle from "./globalStyle";
import Wrapper from "./App.styled";
import { getInfoFromToken, getLocalKey } from "../../helpers/utility";
import MoonIcon from "../../../src/components/utility/MoonIcon";
import SunIcon from "../../../src/components/utility/SunIcon";
import "./global.css";
const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;

export class App extends Component {
  constructor(props) {
    super(props);

    // Lấy giá trị BackgroundLayout từ localStorage hoặc đặt giá trị mặc định
    const initialBackgroundLayout =
      JSON.parse(localStorage.getItem("BackgroundLayout")) || false;

    this.state = {
      BackgroundLayout: false, // Trạng thái lưu giá trị nền
    };
  }

  // Hàm thay đổi trạng thái BackgroundLayout
  toggleBackgroundLayout = () => {
    const newLayout = !this.state.BackgroundLayout;
    this.setState({ BackgroundLayout: newLayout });
    localStorage.setItem("BackgroundLayout", JSON.stringify(newLayout)); // Lưu giá trị mới vào localStorage
  };

  render() {
    const { url } = this.props.match;
    const { locale, selectedTheme, height, ListMenuActive } = this.props;
    const { BackgroundLayout } = this.state;
    const appHeight = window.innerHeight;

    // Lấy thông tin người dùng từ token
    const access_token = getLocalKey("access_token");
    const dataUnzip = getInfoFromToken(access_token);
    const IsAdmin = dataUnzip?.NguoiDung?.IsAdmin;

    return (
      <Wrapper>
        <ConfigProvider>
          <IntlProvider>
            <ThemeProvider theme={themes[selectedTheme]}>
              <AppHolder>
                <GlobalStyle />
                <Layout style={{ height: appHeight }} className={"outerLayout"}>
                  <Debounce time="1000" handler="onResize">
                    <WindowResizeListener
                      onResize={(windowSize) =>
                        this.props.toggleAll(
                          windowSize.windowWidth,
                          windowSize.windowHeight
                        )
                      }
                    />
                  </Debounce>
                  <Layout
                    style={{ flexDirection: "row", overflowX: "hidden" }}
                    className={"middleLayout"}
                  >
                    {/* {IsAdmin ?  : null} */}
                    <Sidebar url={url} />
                    <Notification url={url} />
                    <Layout
                      className="isoContentMainLayout"
                      style={{
                        height: height,
                      }}
                    >
                      <Topbar BackgroundLayout={BackgroundLayout} url={url} />
                      <Content
                        className="isomorphicContent"
                        style={{
                          padding: " 20px 20px",
                          display: "grid",
                          gridTemplateColumns: ListMenuActive?.length
                            ? "11% 89%"
                            : "100%",
                          overflow: "auto",

                          // background: "#fff",
                        }}
                      >
                        <div className="wrapper-content">
                          <AppRouter style={{ height: "100%" }} url={url} />
                        </div>

                      </Content>
                      <Footer
                        style={{
                          textAlign: "center",
                          borderTop: "1px solid #FFFFFF33",
                          padding: "10px 50px",
                          background: BackgroundLayout ? " white" : "#fff",
                        }}
                      >
                        <span
                          style={{
                            marginTop: "10px",
                            marginLeft: "10px",
                            color: "#333",
                          }}
                        >
                          {siteConfig.footerText}
                        </span>
                      </Footer>
                    </Layout>
                  </Layout>
                </Layout>
              </AppHolder>
            </ThemeProvider>
          </IntlProvider>
        </ConfigProvider>
      </Wrapper>
    );
  }
}

export default connect(
  (state) => ({
    auth: state.Auth,
    locale: state.LanguageSwitcher.language.locale,
    selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
    height: state.App.height,
    width: state.App.width,
    isViewIframe: state.App.isViewIframe,
    ListMenuActive: state.App.ListMenuActive,
  }),
  { logout, toggleAll }
)(App);

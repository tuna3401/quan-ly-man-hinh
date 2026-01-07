import React, { Component, useEffect, useRef, useState } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Input,
} from "../../../../components/uielements/exportComponent";
import authAction from "../../../../redux/auth/actions";
import appAction from "../../../../redux/app/actions";
import {
  Row,
  Col,
  Tooltip,
  Modal,
  message,
  Checkbox,
  Input as InputAnt,
} from "antd";
// import dangImage from '../../../../image/dang.png';
// import iconGo from "../../../../image/logo_gosol.png";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import api from "./config";
import { isFullLocalStorage } from "../../../../helpers/utility";
import SignInWrapper from "./styled";
import teamview from "../../../../image/teamview-icon.png";
import ultraview from "../../../../image/ultraview-icon.png";
import { getConfigLocal } from "../../../../helpers/utility";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import actionsCauHinh from "../../../redux/HeThong/CauHinhDangNhap/actions";
import queryString from "query-string";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
const { login } = authAction;
const { clearMenu, getNotifications, getHuongDan, checkIframeSuccess } =
  appAction;
import apiCauHinh from "../CauHinhDangNhap/config";
const date = new Date();
import { useSelector } from "react-redux";
import actionsCauHinhDangNhap from "../../../redux/HeThong/CauHinhDangNhap/actions";
import { getInfoFromToken, getLocalKey } from "../../../../helpers/utility";
const SignIn = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  document.title = "SMARTSIGNAGE";
  const { CauHinhDangNhap } = useSelector((state) => state.CauHinhDangNhap);
  const dispatch = useDispatch();
  const [InfoLogin, setInfoLogin] = useState({
    username: "",
    password: "",
    messageError: "",
    confirmLoading: false,
    stateForm: 1,
  });
  const [InfoContact, setInfoContact] = useState({
    phoneNumber: "----.----.---",
    fax: "----.----.---",
    email: "----@gosol.com.vn",
    TenDonVi: "",
    address: {},
  });

  const reduxStorageNotNull = props.reducerToken !== null;
  const localStorageNotNull = isFullLocalStorage();
  let isLoggedIn = reduxStorageNotNull || localStorageNotNull;

  const [InfoConfigSignIn, setInfoConfigSignIn] = useState({
    ListSlice: [],
    ImageBackground: "",
    ImageLogo: "",
    Title:
      "PHẦN MỀM CƠ SỞ DỮ LIỆU NGÀNH VĂN HÓA THỂ THAO VÀ DU LỊCH  TỈNH BÀ RỊA - VŨNG TÀU",
  });

  const { phoneNumber, fax, email, TenDonVi, address } = InfoContact;
  const { username, password, messageError, confirmLoading } = InfoLogin;
  const { ListSlice, Title, ImageBackground, ImageLogo } = InfoConfigSignIn;

  //Get initData---------------------------------------------
  useEffect(() => {
    if (!isLoggedIn) {
      getThongTinHoTro();
    }
    dispatch(actionsCauHinhDangNhap.getInfo());
  }, []);

  useEffect(() => {
    if (CauHinhDangNhap) {
      const data = CauHinhDangNhap?.reduce(
        (prev, current) => (current.ID > prev.ID ? current : prev),
        { ID: 0 }
      );
      if (data) {
        const SlideAnh = data?.SlideAnh?.split(";");
        const newListSlide = data?.SlideAnhUrl?.split(";")?.map(
          (item, index) => ({
            image: item,
            imageID: SlideAnh[index],
          })
        );
        setInfoConfigSignIn({
          ListSlice: newListSlide,
          ImageBackground: data.HinhNenDangNhapURL
            ? data.HinhNenDangNhapURL.replaceAll("\\", "/")
            : "",
          ImageLogo: data.LogoDangNhapUrl,
          Title: data.TenPhanMem,
        });
      }
    }
  }, [CauHinhDangNhap]);

  useEffect(() => {
    if (ImageBackground) {
      const backgroundContainer = document.querySelector(".signIn-wrap");
      if (backgroundContainer) {
        backgroundContainer.style.backgroundImage = `url(${ImageBackground}) no-repeat center`;
      }
    }
  }, [ImageBackground]);

  const getThongTinHoTro = async () => {
    try {
      const ThongTinHoTro = await api.getDataConfig({
        ConfigKey: "Thong_Tin_Ho_Tro",
      });
      const TenDonVi = await api.getDataConfig({ ConfigKey: "Ten_Don_Vi" });
      if (
        ThongTinHoTro &&
        ThongTinHoTro.data.Status > 0 &&
        TenDonVi.data.Status > 0
      ) {
        let addressArray = ThongTinHoTro.data.Data.ConfigValue.split(";", 3);
        setInfoContact({
          TenDonVi: TenDonVi.data.Data.ConfigValue,
          phoneNumber: addressArray[0] ? addressArray[0] : "----.----.---",
          fax: addressArray[1] ? addressArray[1] : "----.----.---",
          email: addressArray[2] ? addressArray[2] : "----@gosol.com.vn",
        });
      }
    } catch (e) {
      message.error(e.toString());
    }
  };

  const handleLogin = () => {
    setInfoLogin((prevState) => ({ ...prevState, confirmLoading: true }));
    setTimeout(() => {
      //check api
      if (username && password) {
        const data = {
          UserName: username,
          Password: password,
        };
        api
          .dangNhap(data)
          .then((response) => {
            if (response.data.Status > 0) {
              setInfoLogin((prevState) => ({
                ...prevState,
                confirmLoading: false,
                username: "",
                password: "",
                messageError: "",
              }));

              const { login, clearMenu, getNotifications, getHuongDan } = props;
              login(response.data);
              clearMenu();
            } else {
              message.destroy();
              message.warning(response.data.Message);
              setInfoLogin((prevState) => ({
                ...prevState,
                confirmLoading: false,
                messageError: response.data.Message,
              }));
            }
          })
          .catch((error) => {
            systemError();
          });
      } else {
        setInfoLogin((prevState) => ({
          ...prevState,
          confirmLoading: false,
          messageError: "Vui lòng nhập đầy đủ thông tin!",
        }));
      }
    }, 500);
  };

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const systemError = () => {
    setInfoLogin((prevState) => ({ ...prevState, confirmLoading: false }));
    Modal.error({
      title: "Không thể đăng nhập",
      content: `Hệ thống đang trong quá trình bảo trì, vui lòng quay lại sau 17h30 ngày ${moment()}!`,
    });
  };
  const access_token = getLocalKey("access_token");
  const dataUnzip = getInfoFromToken(access_token);
  const IsAdmin = dataUnzip?.NguoiDung?.IsAdmin;
  const from = IsAdmin
    ? { pathname: "/dashboard/danh-muc-co-quan" }
    : { pathname: "/dashboard/" };

  // : { pathname: "/dashboard/khach-hang" };

  const { isPreview } = props;
  if (isLoggedIn && !isPreview) {
    return <Redirect to={from} />;
  } else if (!isPreview) {
    localStorage.clear();
  }

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + "</span>";
    },
  };

  return (
    <>
      <SignInWrapper
        isPreview={isPreview}
        backgroundHeader={ImageBackground}
        className="signIn-wrap"
      >
        <div className="header">
          <div className="header-title">
            <img src={ImageLogo} className="header-logo" />
            <p style={{ color: "#000000" }}>{Title}</p>
          </div>
        </div>
        <div className="main">
          {/* <ForgotPassword /> */}
          <div className={"main-wrapper"}>
            <div className="main-slice">
              <Swiper
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={pagination}
                modules={[Autoplay, Pagination]}
              >
                {ListSlice
                  ? ListSlice.map((slice, index) => (
                    <SwiperSlide key={slice.imageID || index}>
                      <img src={slice.image} />
                    </SwiperSlide>
                  ))
                  : null}
              </Swiper>
            </div>
            <div className="main-content">
              <div className={"main-login"}>
                <div className="main-login__title">
                  <p className={"title"}>Đăng nhập</p>
                </div>
                <div className="main-login__form">
                  <div className="field-wrap">
                    <div className="field-item">
                      <p>Tên đăng nhập</p>
                      <Input
                        onChange={(input) =>
                          setInfoLogin((prevState) => ({
                            ...prevState,
                            username: input.target.value,
                          }))
                        }
                        onKeyUp={_handleKeyDown}
                        value={username}
                        autoFocus
                        disabled={isPreview}
                      />
                    </div>
                    <div className="field-item">
                      <p>Mật khẩu</p>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(input) =>
                          setInfoLogin((prevState) => ({
                            ...prevState,
                            password: input.target.value,
                          }))
                        }
                        disabled={isPreview}
                        onKeyUp={_handleKeyDown}
                      />
                      <span
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        style={{
                          position: "absolute",
                          right: "30px",
                          top: "34.5%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? (
                          <EyeTwoTone />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </span>
                      <div className={"forgot"}>
                        <Link to="/quen-mat-khau">Quên mật khẩu?</Link>
                      </div>
                    </div>
                  </div>
                  <div className={"button"}>
                    <Button
                      onClick={handleLogin}
                      loading={confirmLoading}
                      disabled={isPreview}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </div>
              </div>
              <div className={"helper"}>
                <div className={"help-title"}>Thông tin hỗ trợ</div>
                <div className={"help-row"}>
                  <PhoneOutlined /> {phoneNumber}
                </div>
                <div className={"help-row"}>
                  <MailOutlined /> {email}
                </div>
                <div className={"help-row"}>
                  <img src={teamview} />
                  <a
                    href="https://dl.teamviewer.com/download/version_15x/TeamViewer_Setup_x64.exe"
                    target="_blank"
                  >
                    Tải phần mềm Teamview
                  </a>
                </div>
                <div className={"help-row"}>
                  <img src={ultraview} />
                  <a
                    href="https://dl2.ultraviewer.net/UltraViewer_setup_6.4_vi.exe"
                    target="_blank"
                  >
                    Tải phần mềm Ultraview
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <p>COPYRIGHT @ 2024 GO SOLUTIONS. All rights</p>
        </div>
      </SignInWrapper>
    </>
  );
};

export default connect(
  (state) => ({
    reducerToken: state.Auth.access_token,
    //da dang nhap khi co reduce idToken hoac co localStore
  }),
  { login, clearMenu, getNotifications, getHuongDan, checkIframeSuccess }
)(SignIn);

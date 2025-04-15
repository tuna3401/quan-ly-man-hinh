import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius, boxShadow } from "../../settings/style-util";
import WithDirection from "../../settings/withDirection";

const TopbarWrapper = styled.div`
  .popupSubMenuInline {
    display: grid;
    grid-template-columns: auto auto auto;
  }

  .ant-menu-submenu-popup {
    //background: red;
  }
  .ant-menu-submenu-title {
    display: flex;
    align-items: center;
    height: 100%;
    p {
      color: #fff;
    }
  }
  .ant-menu-item {
    display: flex;
    align-items: center;
  }
  .ant-menu {
  }
  .isomorphicTopbar {
    padding: 15px 50px;
    display: flex;
    margin: 20px;
    border-radius: 10px;
    justify-content: space-between;
    border-bottom: 1px solid #ffffff33;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    background: #fff;
    ${transition()};
    &::after {
      top: 0;
      z-index: -1;
      position: absolute;
      content: "";
      width: 54%;
      height: 100%;
      right: 0;
      //background: #0f6cbd !important;
      /* -webkit-clip-path: polygon(0 0%,95% 0%,100% 100%,0% 100%);
        clip-path: polygon(2% 0, 100% 0, 100% 100%, 0% 100%); */
    }

    @media only screen and (max-width: 767px) {
      /* padding: 0px 15px 0px 15px !important; */
    }

    @media only screen and (max-width: 1200px) {
      /* display: none; */
      &::after {
        display: none;
      }
    }

    /* &.collapsed {
      padding: 0 31px 0 15px;
      @media only screen and (max-width: 767px) {
        padding: 0px 15px !important;
      }
    } */
    .siteName_topbar {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: bold;
      /* color: ${palette("text", 5)}; */
      text-transform: uppercase;
      color: #fff;
      position: relative;
      &::after {
        top: 0;
        z-index: -1;
        position: absolute;
        content: "";
        width: 110%;
        height: 100%;
        right: 0;
        //background: #0f6cbd !important;
        /* -webkit-clip-path: polygon(0 0%,95% 0%,100% 100%,0% 100%); */
        clip-path: polygon(6% 0, 100% 0, 100% 100%, 0% 100%);
      }
      /* &::after
      {
        top: 0;
        z-index: -1;
        position: absolute;
        content: '';
        width: 66%;
        height: 100%;
        right: 0;
        //background: #EAF1FB !important;
        -webkit-clip-path: polygon(0 0%,95% 0%,100% 100%,0% 100%);
        clip-path: polygon(2% 0, 100% 0, 100% 100%, 0% 100%);
      }  */
      &::before {
        top: 0;
        z-index: -1;
        position: absolute;
        content: "";
        left: -15%;
        width: 10%;
        height: 100%;
        //background: #0f6cbd !important;
        clip-path: polygon(68% 0, 100% 0, 35% 100%, 0% 100%);
      }
      @media only screen and (max-width: 1200px) {
        display: none;
        &::after {
          display: none;
        }
        &::before {
          display: none;
        }
      }
    }

    .isoIconWrapper i {
      color: ${palette("primary", 16)} !important;
    }

    .isoLeft {
      display: flex;
      align-items: center;
      min-width: max-content;
      position: relative;
      column-gap: 10px;
      /* padding: 0 10px; */

      .triggerHeader {
        font-size: 18px;
        font-weight: 600;
        color:rgb(71, 68, 68);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
      }

      img {
        width: 30px;
        display: inline-block;
        margin-right: 10px;
      }

      .triggerBtn {
        width: ${(props) =>
          props?.SidebarWidth ? `${props.SidebarWidth}px` : "24px"};
        /* height: 100%; */
        align-items: center;
        justify-content: center;
        //background-color: ${palette("primary", 16)};
        color: #000;
        border: 0;
        outline: 0;
        position: relative;
        cursor: pointer;
        display: none;
        /* padding-left: 17px;
        padding-right: 48px; */
        /* display: none; */
        /* margin-left: 5px;
        margin-right: 5px; */

        &:before {
          content: "\f20e";
          font-family: "Poppins", sans-serif;
          font-size: 26px;
          color: inherit;
          line-height: 0;
          position: absolute;
        }

        @media only screen and (max-width: 500px) {
          display: block;
        }
      }
    }

    .isoRight {
      display: flex;
      justify-content: end;
      align-items: center;
      background: #ffffff0d;
      border-radius: 10px;
      width: 200px;
      padding-left: 10px;
      .question-circle {
        color: #fff;
      }
      li {
        margin-left: ${(props) => (props["data-rtl"] === "rtl" ? "35px" : "0")};
        margin-right: ${(props) =>
          props["data-rtl"] === "rtl" ? "0" : "35px"};
        cursor: pointer;
        line-height: normal;
        position: relative;
        display: inline-block;

        @media only screen and (max-width: 360px) {
          margin-left: ${(props) =>
            props["data-rtl"] === "rtl" ? "25px" : "0"};
          margin-right: ${(props) =>
            props["data-rtl"] === "rtl" ? "0" : "25px"};
        }

        &:last-child {
          margin: 0;
        }

        i {
          font-size: 24px;
          color: ${palette("text", 0)};
          line-height: 1;
        }

        .isoIconWrapper {
          position: relative;
          line-height: normal;

          span {
            font-size: 12px;
            color: #fff;
            //background-color: ${palette("secondary", 1)};
            width: 20px;
            height: 20px;
            display: -webkit-inline-flex;
            display: -ms-inline-flex;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 20px;
            position: absolute;
            top: -8px;
            left: ${(props) =>
              props["data-rtl"] === "rtl" ? "inherit" : "10px"};
            right: ${(props) =>
              props["data-rtl"] === "rtl" ? "10px" : "inherit"};
            ${borderRadius("50%")};
          }
        }

        &.isoNotify {
          .isoIconWrapper {
            span {
              //background-color: ${palette("primary", 2)};
            }
          }
        }

        &.isoUser {
          .isoImgWrapper {
            width: 40px;
            height: 40px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            //background-color: ${palette("grayscale", 9)};
            ${borderRadius("50%")};

            img {
              height: 100%;
              object-fit: cover;
            }

            .userActivity {
              width: 10px;
              height: 10px;
              display: block;
              //background-color: ${palette("color", 3)};
              position: absolute;
              bottom: 0;
              right: 3px;
              border: 1px solid #ffffff;
              ${borderRadius("50%")};
            }
          }
        }
      }
    }

    .isoDashboardMenu {
      //background: transparent;
      border-inline-end: none !important;
      border-bottom: none;
      margin-right: auto;
      margin-left: 10px;
      width: 100%;
      overflow: hidden;
      @media only screen and (max-width: 500px) {
        display: none;
      }

      a {
        text-decoration: none;
        font-weight: 400;
      }

      .isoMenuHolder {
        align-items: center;
        color: #fff !important;

        i {
          font-size: 19px;
          color: inherit;
          margin: 0 15px 0 0;
          width: 18px;
          ${transition()};
        }
      }

      .ant-menu-overflowed-submenu {
        color: #fff;
      }

      .nav-text {
        font-size: 16px;
        color: #666;
        ${transition()};
      }

      .ant-menu-item-selected {
        //background-color: ${palette("primary", 15)} !important;
        .anticon {
          color: #ff6b00;
        }

        i {
          color: #ff6b00;
        }

        .nav-text {
          color: #666;
        }
      }

      .ant-menu-item:hover {
        border-radius: 6px;
      }
      .ant-menu-item a {
        color: #fff;
      }

      > li {
        &:hover {
          i,
          .nav-text {
            color: #ff6b00;
          }
        }
      }

      .ant-menu-submenu-selected {
        //background-color: ${palette("primary", 15)} !important;
      }

      .ant-menu-item-selected {
        //background-color: ${palette("primary", 15)} !important;
        border-radius: 6px;
      }
    }
  }

  .isoUserDropdown {
    .ant-popover-inner {
      .ant-popover-inner-content {
        .isoUserDropdownContent {
          padding: 7px 0;
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          //background-color: #ffffff;
          width: 220px;
          min-width: 160px;
          flex-shrink: 0;
          ${borderRadius("5px")};
          ${boxShadow("0 2px 10px rgba(0,0,0,0.2)")};
          ${transition()};

          .isoDropdownLink {
            font-size: 13px;
            color: ${palette("text", 1)};
            line-height: 1.1;
            padding: 7px 15px;
            //background-color: transparent;
            text-decoration: none;
            display: flex;
            justify-content: flex-start;
            ${transition()};

            &:hover {
              //background-color: ${palette("secondary", 6)};
            }
          }
        }
      }
    }
  }

  // Dropdown
  .ant-popover {
    .ant-popover-inner {
      .ant-popover-inner-content {
        .isoDropdownContent {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          right: 0;
          //background-color: #ffffff;
          width: 360px;
          min-width: 160px;
          flex-shrink: 0;
          ${borderRadius("5px")};
          ${boxShadow("0 2px 10px rgba(0,0,0,0.2)")};
          ${transition()};

          @media only screen and (max-width: 767px) {
            width: 310px;
          }

          .isoDropdownHeader {
            border-bottom: 1px solid #f1f1f1;
            margin-bottom: 0px;
            padding: 15px 30px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            h3 {
              font-size: 14px;
              font-weight: 500;
              color: ${palette("text", 0)};
              text-align: center;
              text-transform: uppercase;
              margin: 0;
            }
          }

          .isoDropdownBody {
            width: 100%;
            height: 300px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            //background-color: ${palette("grayscale", 6)};

            .isoDropdownListItem {
              padding: 15px 30px;
              flex-shrink: 0;
              text-decoration: none;
              display: flex;
              flex-direction: column;
              text-decoration: none;
              width: 100%;
              ${transition()};

              &:hover {
                //background-color: ${palette("grayscale", 3)};
              }

              .isoListHead {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
              }

              h5 {
                font-size: 13px;
                font-weight: 500;
                color: ${palette("text", 0)};
                margin-top: 0;
              }

              p {
                font-size: 12px;
                font-weight: 400;
                color: ${palette("text", 2)};
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .isoDate {
                font-size: 11px;
                color: ${palette("grayscale", 1)};
                flex-shrink: 0;
              }
            }
          }

          .isoViewAllBtn {
            font-size: 13px;
            font-weight: 500;
            color: ${palette("text", 2)};
            padding: 10px 15px 20px;
            display: flex;
            text-decoration: none;
            align-items: center;
            justify-content: center;
            text-align: center;
            ${transition()};

            &:hover {
              color: ${palette("primary", 0)};
            }
          }

          .isoDropdownFooterLinks {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 30px 20px;

            a {
              font-size: 13px;
              font-weight: 500;
              color: ${palette("text", 0)};
              text-decoration: none;
              padding: 10px 20px;
              line-height: 1;
              border: 1px solid ${palette("border", 1)};
              display: flex;
              align-items: center;
              justify-content: center;
              ${transition()};

              &:hover {
                //background-color: ${palette("primary", 0)};
                border-color: ${palette("primary", 0)};
                color: #ffffff;
              }
            }

            h3 {
              font-size: 14px;
              font-weight: 500;
              color: ${palette("text", 0)};
              line-height: 1.3;
            }
          }

          &.withImg {
            .isoDropdownListItem {
              display: flex;
              flex-direction: row;

              .isoImgWrapper {
                width: 35px;
                height: 35px;
                overflow: hidden;
                margin-right: 15px;
                display: -webkit-inline-flex;
                display: -ms-inline-flex;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                //background-color: ${palette("grayscale", 9)};
                ${borderRadius("50%")};

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }

              .isoListContent {
                width: 100%;
                display: flex;
                flex-direction: column;

                .isoListHead {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                }

                h5 {
                  margin-bottom: 0;
                  padding-right: 15px;
                }

                .isoDate {
                  font-size: 11px;
                  color: ${palette("grayscale", 1)};
                  flex-shrink: 0;
                }

                p {
                  white-space: normal;
                  line-height: 1.5;
                }
              }
            }
          }
        }
      }
    }

    &.topbarMail {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 519px) {
              right: -170px;
            }
          }
        }
      }
    }

    &.topbarMessage {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 500px) {
              right: -69px;
            }
          }
        }
      }
    }

    &.topbarNotification {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 500px) {
              right: -120px;
            }
          }
        }
      }
    }

    &.topbarAddtoCart {
      .ant-popover-inner {
        .ant-popover-inner-content {
          .isoDropdownContent {
            @media only screen and (max-width: 465px) {
              right: -55px;
            }

            .isoDropdownHeader {
              margin-bottom: 0;
            }

            .isoDropdownBody {
              //background-color: ${palette("grayscale", 6)};
            }
          }
        }
      }
    }
  }
`;

export default WithDirection(TopbarWrapper);

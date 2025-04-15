import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius } from "../../settings/style-util";

const widthCollaped = "80px";
const widthCollapedMobile = "0px";
const widthExpanded = "320px";

const SidebarWrapper = styled.div`
  .triggerHeader {
    /* color: ${palette("text", 5)}; */
    color: #333;
    font-family: "Poppins", sans-serif;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    @media only screen and (max-width: 500px) {
      display: none;
    }
    margin-bottom: 35px;
  }
  /* padding: 0px 5px 0px 5px; */
  .ant-menu-title-content {
    font-size: 14px;
  }
  .ant-menu-inline .ant-menu-item {
    height: 35px;
  }
  .wrapper-content__item {
    display: flex;
    align-items: center;
    img {
      margin-right: 5px;
      width: 25px;
      height: 25px;
    }
    .nav-text {
      font-family: "Poppins", sans-serif;
    }
  }
  .isomorphicSidebar {
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.12);
    z-index: 999;
    /* background: ${palette("primary", 14)};
    color: ${palette("secondary", 1)}; */
    // background: ${palette("sidebar", 0)};
    color: #666;
    width: ${widthExpanded} !important;
    flex: 0 0 ${widthExpanded} !important;
    max-width: ${widthExpanded} !important;
    min-width: ${widthExpanded} !important;
    transition: all 0.3s ease;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    .scrollarea {
      height: calc(100vh - 70px);
    }

    @media only screen and (max-width: 500px) {
      position: absolute;
      box-shadow: 12px 0 15px -4px rgba(0, 0, 0, 0.3);
      width: 100% !important;
      flex: 0 0 100% !important;
      max-width: 100% !important;
      min-width: 220px !important;
    }

    &.ant-layout-sider-collapsed {
      width: ${widthCollaped};
      min-width: ${widthCollaped} !important;
      max-width: ${widthCollaped} !important;
      flex: 0 0 ${widthCollaped} !important;

      @media only screen and (max-width: 500px) {
        width: ${widthCollapedMobile};
        min-width: ${widthCollapedMobile} !important;
        max-width: ${widthCollapedMobile} !important;
        flex: 0 0 ${widthCollapedMobile} !important;
      }
    }

    .isoLogoWrapper {
      height: 50px;
      margin: 70px 0 0 0;
      padding: 0 10px;
      text-align: center;
      overflow: hidden;
      ${borderRadius()};

      div {
        a {
          font-size: 21px;
          line-height: 70px;
          text-transform: uppercase;
          color: #ffffff;
          /* color: ${palette("primary", 14)}; */
          display: block;
          text-decoration: none;
        }
      }
    }

    &.ant-layout-sider-collapsed {
      .isoLogoWrapper {
        padding: 0;

        background-size: 40px;
        background-repeat: no-repeat;
        background-position: center;

        h3 {
          a {
            font-size: 27px;
            font-weight: 500;
            letter-spacing: 0;
          }
        }
      }
    }

    .isoDashboardMenu {
      border-top: 1px solid #f0f0f0;
      padding: 20px 40px 35px 20px;
      border-inline-end: none !important;
      background: transparent;
      /* margin-top: 70px; */
      a {
        text-decoration: none;
        font-weight: 400;
      }

      .ant-menu-item {
        width: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 !important;
        margin: 0;

        &::after {
          border-right: 0;
        }
      }

      .isoMenuHolder {
        display: flex;
        align-items: center;
        color: ${palette("secondary", 1)};

        i {
          font-size: 19px;
          color: inherit;
          margin: 0 30px 0 0;
          width: 18px;
          ${transition()};
        }

        ion-icon {
          color: #ffffff;
          /* color: inherit; */
          margin: 0 15px 0 10px;
          width: 24px;
          height: 24px;
          ${transition()};
        }

        &.current {
          ion-icon {
            color: #ffffff;
            /* color: ${palette("primary", 14)}; */
          }
        }
      }

      .anticon {
        font-size: 18px;
        margin-right: 30px;
        color: inherit;
        ${transition()};
      }

      .nav-text {
        font-size: 17.5px;
        /* color: inherit; */
        color: #666;
        ${transition()};
        /* color :  */
      }

      .ant-menu-submenu-inline
        .ant-menu-inline
        > .ant-menu-item:not(.ant-menu-item-group):not(
          .ant-menu-item-selected
        ):hover
        a,
      .ant-menu-submenu-vertical
        .ant-menu-inline
        > .ant-menu-item:not(.ant-menu-item-group):not(
          .ant-menu-item-selected
        ):hover
        a,
      .ant-menu-submenu-inline
        .ant-menu-submenu-vertical
        > .ant-menu-item:not(.ant-menu-item-group):not(
          .ant-menu-item-selected
        ):hover
        a,
      .ant-menu-submenu-vertical
        .ant-menu-submenu-vertical
        > .ant-menu-item:not(.ant-menu-item-group):not(
          .ant-menu-item-selected
        ):hover
        a {
        color: #ff6b00 !important;
      }
      /* .ant-menu-item-active .ant-menu-title-content {
        .nav-text {
          color: #FFFFFF !important;
        }
      } */
      .ant-menu-item-selected {
        background-color: rgba(255, 107, 0, 0.08) !important;
        /* border-radius: 111px; */
        /* background-color: ${palette("sidebar", 2)}; */
        /* background-color: ${palette("secondary", 1)} !important; */
        .anticon {
          color: #ff6b00 !important;
          /* color: #FFFFFF; */
          /* color: ${palette("primary", 14)}; */
        }

        i {
          color: #ff6b00 !important;
          /* color: #FFFFFF; */
          /* color: ${palette("primary", 14)}; */
        }

        ion-icon {
          color: #ff6b00 !important;
          /* color: #FFFFFF; */
          /* color: ${palette("primary", 14)}; */
        }

        .nav-text,
        .ant-menu-title-content {
          color: #ff6b00 !important;
          /* color: #FFFFFF; */
          /* color: ${palette("primary", 14)}; */
        }

        &::after {
          border-right: 0;
        }
      }
      .ant-menu-item .ant-menu-item-only-child :hover {
        background-color: red !important;
      }
    }

    .ant-menu-dark .ant-menu-inline.ant-menu-sub {
      background: ${palette("secondary", 5)};
    }

    .ant-menu-submenu-inline,
    .ant-menu-submenu-vertical {
      > .ant-menu-submenu-title {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 0 !important;

        > span {
          display: flex;
          align-items: center;
        }

        .ant-menu-submenu-arrow {
          opacity: 1;
          left: auto;
          right: 25px;
          &:before,
          &:after {
            background: #999;
            width: 8px;
            ${transition()};
          }
        }
      }
      .menu-topbar.popupSubMenuInline .ant-menu-submenu-title:hover {
        background-color: rgba(255, 107, 0, 0.08) !important;
        color: #ff6b00 !important;
      }
      /* .parent-menu__item {
        border-left: 3px solid #ff6b00;
      } */

      .ant-menu-inline,
      .ant-menu-submenu-vertical {
        > li:not(.ant-menu-item-group) {
          padding-left: 35px !important;
          padding-right: 0px !important;
          font-size: 13px;
          font-weight: 400;
          margin: 0;
          height: 50px;
          color: inherit;
          ${transition()};

          &:hover {
            a {
              color: #ff6b00 !important;
            }
          }
        }

        .ant-menu-item-group {
          padding-left: 0;

          .ant-menu-item-group-title {
            padding-left: 100px !important;
          }
          .ant-menu-item-group-list {
            .ant-menu-item {
              padding-left: 125px !important;
            }
          }
        }
      }

      .ant-menu-sub {
        box-shadow: none;

        background-color: transparent !important;
      }

      &:hover {
        color: black;
      }
    }

    &.ant-layout-sider-collapsed {
      .nav-text {
        /* display: none; */
        border-left: 3px solid #ff6b00 !important;
      }
      .ant-menu-submenu-arrow {
        display: none;
      }
      .ant-menu-submenu-inline > {
        .ant-menu-submenu-title:after {
          display: none;
        }
      }

      .ant-menu-submenu-vertical {
        > .ant-menu-submenu-title:after {
          display: none;
        }

        .ant-menu-sub {
          background-color: transparent !important;

          .ant-menu-item {
            height: 35px;
          }
        }
      }
    }
  }
  :where(.css-dev-only-do-not-override-cg4vza).ant-menu-light:not(
      .ant-menu-horizontal
    )
    .ant-menu-item:not(.ant-menu-item-selected):hover,
  :where(.css-dev-only-do-not-override-cg4vza).ant-menu-light
    > .ant-menu:not(.ant-menu-horizontal)
    .ant-menu-item:not(.ant-menu-item-selected):hover {
    background-color: rgba(255, 107, 0, 0.08) !important;
    color: #ff6b00;
  }
  /* .ant-menu-submenu-title :hover {
  background-color: rgba(255, 107, 0, 0.08) ;
} */
  :where(.css-dev-only-do-not-override-cg4vza).ant-menu-inline.ant-menu-root
    .ant-menu-submenu-title
    > .ant-menu-title-content
    :hover {
    background-color: transparent !important;
    color: #ff6b00;
  }
  :where(.css-dev-only-do-not-override-cg4vza)
    .ant-menu
    .ant-menu-submenu-inline.parent-menu__item:hover
    > div {
    background-color: rgba(255, 107, 0, 0.08) !important;
    color: #ff6b00;
  }
  :where(.css-dev-only-do-not-override-cg4vza).ant-layout-header {
    height: 64px;
    padding: 0 20px;
    color: rgba(0, 0, 0, 0.88);
    line-height: 64px;
    background: #001529;
  }
  .isomorphicSidebar .ant-menu-submenu-inline > .ant-menu-submenu-title,
  .edfafv
    .isomorphicSidebar
    .ant-menu-submenu-vertical
    > .ant-menu-submenu-title {
    width: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 50px;
  }
`;

export default SidebarWrapper;

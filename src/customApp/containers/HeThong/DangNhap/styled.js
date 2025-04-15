import styled from 'styled-components';
import bgImage from '../../../../image/loginKKTS.png';
import {transition} from '../../../../settings/style-util'; // import palete from ''
import Background__header from '../../../../image/background__header.png';
import {palette} from 'styled-theme';

export default styled.div`
  ${transition()};
  background: url(${(props) => props.backgroundHeader}) no-repeat center;
  background-size: cover;
  height: ${(props) => (props.isPreview ? 'auto' : '100vh')};
  overflow: auto;
  display: grid;
  .swiper-wrapper {
    min-width: 400px;
  }
  .swiper {
    width: 100%;
    height: 100%;
    border-radius: 20px 0px 0px 20px;
  }

  .swiper-slide {
    border-radius: 20px 0px 0px 20px;
    text-align: center;
    font-size: 18px;
    background: #fff;
    height: 100% !important;
    /* max-width: 500px; */
    max-height: 600px;
    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      border-radius: 20px 0px 0px 20px;
    }
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-pagination {
    .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      background: #d9d9d9;
    }
    .swiper-pagination-bullet-active {
      background: #00ffc2;
    }
  }

  .header-title {
    top: 0;
    /* top: 50px; */
    position: absolute;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    text-align: center;
    width: 100%;
    z-index: 999;
    background-color: transparent;
    color: ${palette('primary', 17)};
    font-weight: 500;
    font-size: var(--title);
    .header-logo {
      width: 50px;
      height: auto;
    }
  }
  .header {
    position: relative;
  }
  .main {
    display: grid;
    align-items: center;
    height: max(100%, auto);
  }
  .main-wrapper {
    border: 1px solid ${palette('border', 0)};
    border-radius: 20px;
    /* justify-content: center; */
    align-items: center;
    /* padding: 40px 0; */
    display: grid;
    max-width: 930px;
    grid-template-columns: 60% auto;
    margin: 80px auto;
    /* position: relative;
    top: 50%;
    transform: translateY(-50%); */
    .main-slice,
    .main-content {
      height: 100%;
    }
    .main-content {
      border-radius: 0px 20px 20px 0px;
      padding: 18px;
      background: rgba(255, 255, 255, 1);
      position: relative;
    }

    .head-text {
      font-size: 36px;
      font-weight: bold;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 50px;
      text-align: center;
      // display: none;
    }

    .main-login {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .main-login__title {
        .title {
          font-size: var(--title);
          margin-bottom: 51px;
          font-family: 'Poppins', sans-serif !important;
          text-transform: uppercase;
        }
      }
      .main-login__form {
        width: 100%;
        .field-wrap {
          flex-direction: column;
          gap: 9px;
          display: flex;
          .field-item {
            p {
              font-size: var(--content);
              color: #777777;
            }
            .ant-input {
              margin-top: 10px;
              width: 100%;
              background: #e9e9e9;
            }
            .forgot {
              display: inline-block;
              margin-top: 9px;
              margin-left: auto;
              cursor: pointer;
              text-align: right;
              width: 100%;
              a {
                font-size: var(--content);
                text-decoration: none;
              }

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }

      .button .ant-btn,
      .field-item .ant-input {
        height: 43px;
        background: #e9e9e9;
      }
      .button {
        margin-top: 30px;

        .ant-btn {
          background: ${palette('primary', 0)};
          color: ${palette('primary', 17)};
          width: 100%;
          font-size: 20px;
          border-radius: 8px;
        }
      }

      .text-error {
        color: red;
      }
    }
  }

  .helper {
    margin-top: 58px;
    margin-bottom: 4px;
    .help-title {
      font-size: var(--subtitle);
      margin-bottom: 15px;
    }
    .help-row + .help-row {
      margin-top: 5px;
    }
    .help-row {
      font-size: var(--smallContent);
      display: flex;
      align-items: center;
      .anticon {
        font-size: 20px;
        margin-right: 10px;
      }

      img {
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }

      a {
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .footer {
    display: flex;
    align-items: end;
    justify-content: center;
    bottom: 10px;
    width: 100%;
    color: #fff;
    margin-bottom: 15px;
  }

  @media only screen and (max-width: 991px) {
    .main-wrapper {
      grid-template-columns: auto;
      .main-slice {
        display: none;
      }
    }
  }
`;

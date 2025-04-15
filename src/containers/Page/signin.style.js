import styled from 'styled-components';
import { palette } from 'styled-theme';
import bgImage from '../../image/theme.png';
import WithDirection from '../../settings/withDirection';

const SignInStyleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;
  overflow: hidden;
  font-family: 'Poppins', sans-serif !important;
  
  html h1, html h2, html h3, html h4, html h5, html h6, a, p, html li, input, textarea, span, div, html, body, html a {
    font-family: 'Poppins', sans-serif !important;
  }
  h1, h2, h3, h4, h5, h6, button{
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
  }
  
  .colInfo {
    display: flex;
    justify-content: center;
    align-items: center;
    
    .divInfo {
      text-align: center;
      color: white;
      @media only screen and (max-width: 991px) {
        display: none;
      }
      h1, h2, h3, h4, h5, h6 {
        color: white;
      }
      h3 {
        font-size: 30px;
      }
      h2 {
        font-size: 55px;
        @media only screen and (max-width: 1300px) {font-size: 45px;}
      }
      img {width: 80px; height: 80px; margin-bottom: 10px;}
      button {
        color: white;
        background: none;
        border: 1px solid white;
        outline: none;
        box-shadow: none;
        cursor: default;
        user-select: text;
        div {padding: 0; margin: 0; font-size: 13px; color: lightgrey};
      }
      button:focus {
        outline: none;
        box-shadow: none;
      }
      .buttonIcon {
        left: 14px;
        height: 36px;
      }
      .buttonContent {
        border-left: none;
        border-radius: 0 50px 50px 0;
      }
    }
  }

  // &:before {
  //   content: '';
  //   width: 100%;
  //   height: 100%;
  //   display: flex;
  //   //background-color: rgba(0, 0, 0, 0.6);
  //   position: absolute;
  //   z-index: 1;
  //   top: 0;
  //   left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
  //   right: ${props => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  // }
  
  .colLogin {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 25px;
  }

  .isoLoginContentWrapper {
    max-width: 480px;
    height: 70%;
    //overflow-y: auto;
    z-index: 10;
    position: relative;
    display: flex;
    align-items: center;
  }

  .isoLoginContent {
    flex: 1;
    padding: 80px 50px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.75);

    @media only screen and (max-width: 767px) {
      width: 100%;
    }

    .isoLogoWrapper {
      width: 100%;
      display: flex;
      margin-bottom: 50px;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;
      text-align: center;
      a {
        font-size: 24px;
        font-weight: 300;
        line-height: 1;
        text-transform: uppercase;
        color: ${palette('secondary', 2)};
      }
    }

    .isoSignInForm {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      .divMessage {
        font-size: 20px;
        font-family: 'Poppins', sans-serif !important;
        color: green;
        padding: 0 20px;
        width: 100%;
        position: absolute;
        left: 0;
        top: 36px;
        text-align: center;
      }
      .isoInputWrapper {
        margin-bottom: 15px;

        &:last-of-type {
          margin-bottom: 0;
        }
        label {
          font-size: 25px;
          color: green;
        }
        input {
          border-radius: 12px;
          height: 50px;
          font-size: 20px;
          &::-webkit-input-placeholder {
            color: ${palette('grayscale', 0)};
            font-style: italic;
            font-size: 20px;
          }

          &:-moz-placeholder {
            color: ${palette('grayscale', 0)};
            font-style: italic;
            font-size: 20px;
          }

          &::-moz-placeholder {
            color: ${palette('grayscale', 0)};
            font-style: italic;
            font-size: 20px;
          }
          &:-ms-input-placeholder {
            color: ${palette('grayscale', 0)};
            font-style: italic;
            font-size: 20px;
          }
        }
      }
      
      .isoButtonLogin{
        button {
          background: #e60000;
          border: none;
          border-radius: 12px;
          height: 50px;
          font-size: 25px;
          width: 100%;
        }
      }
      .isoLeftRightComponent{
        a {
          display: inline-bock;
          font-size: 14px;
        }
        .isoForgotPass {
        font-size: 15px;
          color: #e60000;
          text-decoration: underline;
          &:hover {
            color: ${palette('primary', 0)};
          }
        }
        .linkDownload {
          border-bottom: 1px solid darkgrey;
          color: grey;
        }
      }
      
      .addressOther {
        padding: 5px 0 15px 0;
        @media only screen and (min-width: 991px) {
          display: none;
        }
        p {
          font-weight: 600;
        }
      }

      button {
        font-weight: 500;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 20px;
    width: 100%;
    text-align: center;
    color: darkgrey;
    font-size: 12px;
    font-family: 'Poppins', sans-serif !important;
  }
`;

export default WithDirection(SignInStyleWrapper);

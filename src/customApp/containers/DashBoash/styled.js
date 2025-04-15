import styled from 'styled-components';
import {transition} from '../../../settings/style-util';
import {palette} from 'styled-theme';

export default styled.div`
  .dashboard-wrapper__more {
    padding-bottom: 35px;
    /* max-height: 350px; */
    overflow: scroll;
  }
  .dashboard-wrapper {
    .dashboard-filter {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      .dashboard-filter__items {
        display: flex;
        align-items: center;
        gap: 15px;
      }
    }
    .dashboard-wrapper__card {
      position: relative;
      margin-top: 22px;
      display: grid;
      gap: 15px;
      grid-template-columns: calc(33.33% - 15px) calc(33.33% - 15px) calc(
          33.33% - 15px
        );
      .ant-spin {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
      }
      .card-link {
        height: 100%;
      }
      .loading-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        background: rgba(255, 255, 255, 0.7);
        /* opacity: 0.1; */
        z-index: 99;
      }
      .card-item {
        height: 100%;
        border: 1px solid #bdbdbd;
        border-radius: 5px;
        box-shadow: rgb(189, 189, 189) 0px 1px 4px 2px;
        .card-item_top {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 15px 10px;
          border-bottom: 1px solid #bdbdbd;
          background: #dddddd;
          .icon img {
            width: 40px;
            height: 40px;
          }
          .title {
            color: #fff;
            font-weight: 700;
          }
        }
        .card-item_body {
          padding: 0 10px 5px 10px;
          & .item__desc:nth-child(even) {
            .item__desc__circle {
              background: #0f6cbd;
            }
          }
          & .item__desc:nth-child(odd) {
            .item__desc__circle {
              background: #ff6f00;
            }
          }
          .item__desc {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 7px 0;
            border-bottom: 1px dotted;
            p {
              color: #000;
            }
            .item__desc__circle {
              color: #fff;
            }
            .item__desc__circle {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-weight: 500;
            }
          }
        }
        /* padding: 10px 0; */
      }
    }
  }
  .loading-spin_antd {
    width: 100%;
    height: 100%;
    background: ${(props) =>
      props.isLoadingInit ? 'transparent' : 'rgba(255,255,255,0.4)'};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
  }
  .content-wrapper {
    height: calc(100% - 150px);
    padding: 10px 0;
    max-height: 600px;

    .ant-row {
      height: 100%;
    }
    .ant-col {
      /* height: 100%; */
    }
  }
  .wrapper-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    /* overflow-y: auto;
    overflow-x: hidden; */
  }
  .wrapper-box::-webkit-scrollbar {
    width: 3px;
    height: 5px;
  }
  .wrapper-top {
    max-width: 100%;
    overflow: hidden;
  }
  .chart-title {
    transform: rotate(-90deg);
    transform-origin: top left;
  }
  .swiper-pagination {
    display: none;
  }
  .swiper-button-prev:after,
  .swiper-rtl .swiper-button-next:after {
    font-size: 30px;
  }
  .swiper-button-next:after,
  .swiper-rtl .swiper-button-prev:after {
    font-size: 30px;
  }
  .toolbar {
    padding: 0 0 10px 10px !important;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    &.toolbar .swiper-wrapper .swiper-slide:first-child .toolbar-item__icon {
      flex-direction: column;
      row-gap: 1px;
    }
    &.toolbar .swiper-wrapper .swiper-slide:first-child .toolbar-item__icon {
      background: #2878d7;
      img {
        max-height: 24px;
      }
      p {
        font-size: 13px;
        color: #fff;
      }
    }
    &.toolbar .swiper-wrapper .swiper-slide:last-child .toolbar-item__icon {
      background: #d01e1e;
    }
    & .swiper-wrapper .swiper-slide:nth-child(odd) .toolbar-item__icon {
      background: #ff6f00;
    }
    & .swiper-wrapper .swiper-slide:nth-child(even) .toolbar-item__icon {
      background: #2878d7;
    }

    .toolbar-item {
      border: 1px dashed #bdbdbd;
      padding: 20px 10px;
      display: flex;
      background: #fff;
      align-items: center;
      display: flex;
      justify-content: space-between;
      .toolbar-item__content {
        .item__content__title {
          font-size: 18px;
          margin-top: 5px;
        }
        .item__content__data {
          font-size: 20px;
          font-weight: 600;
        }
        .item_data_filter {
          display: grid;
          grid-template-columns: auto auto;
          flex-wrap: wrap;
          gap: 5px;
          p {
            background: #f2f2f2;
            padding: 5px;
            font-size: 14px;
            border-radius: 5px;
            box-shadow: 1px 1px 5px;
          }
        }
      }
      .toolbar-item__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 11px;
        border-radius: 50%;
      }
      .toolbar-item__icon img {
        max-width: 40px;
        height: auto;
      }
    }
  }
  .filter_chart {
    padding: 5px 0 20px 0;
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    .active-btn {
      background: #2878d7 !important;
      color: #fff;
      box-shadow: rgb(0, 0, 0) 3px 2px 6px 0px;
    }
    .chart-btn {
      padding: 10px 0;
      font-size: 13px;
      font-weight: 600;
      width: 120px;
      border: 1px solid #2878d7;
      outline: none;
      background: #f6f8fc;
      cursor: pointer;
    }
    .chart-btn + .chart-btn {
    }
  }
  .row-container {
  }
  .wrapper_content {
    /* max-height: calc(100vh - 280px); */
    display: flex;
    flex: 1;
    height: 100%;
    padding: 10px;
    background: #f6f8fc;
    box-shadow: 1px 0px 6px -1px;
  }
  .wrapper_dashboard {
    flex: 1;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    .title-chart {
      display: flex;
      justify-content: left;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px dashed #bdbdbd;

      p {
        font-weight: 600;
        font-size: 16px;
        text-align: 'left';
      }
    }
    .bar_chart {
      display: grid;
      height: inherit;
      grid-template-columns: calc(100% - 180px) 150px;
      column-gap: 30px;
      /* height: 100%; */
      .chart {
        /* height: 100%; */
      }
      .chart div {
        height: 100%;
      }
      canvas {
        /* height: 100% !important; */
      }
      /* .chart {
        height: inherit;
        flex-basis: 70%;
        flex-grow: 1;
        width: 100%;
        div {
          height: inherit;
          width: 100%;
          canvas {
            height: auto !important;
            width: 100% !important;
          }
        }
      }
      .subtitle {
        flex: auto;
      } */
    }
    .polearea_chart {
      display: flex;
      height: 100%;
      flex-direction: column;
      .subtitle {
        max-height: 50px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        margin-bottom: 15px;
        .subtitle_item {
          margin-top: 0;
        }
      }
      .chart {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        canvas {
          max-width: 100% !important;
          max-height: 350px !important;
          height: 100% !important;
          max-width: 100%;
        }
      }
    }
  }
  .subtitle {
    margin-top: 10px;
    flex: auto;
    display: inline-block;
    .subtitle_item {
      font-size: 14px;
      padding: 10px 0px;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-family: 'Poppins', sans-serif !important;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #000000;
      border: 1px solid;
    }
    .subtitle_item + .subtitle_item {
      margin-top: 15px;
    }
  }

  @media only screen and (max-width: 1750px) {
    .wrapper-top {
      position: relative;
    }
    .row-top {
      padding: 0 30px;
    }
    .swiper-button-next {
      right: -5px;
    }
    .swiper-button-prev {
      left: -5px;
    }
    .toolbar {
      padding: 0 10px 10px 10px !important;
    }
  }
  @media only screen and (max-width: 1200px) {
    .toolbar .toolbar-item .toolbar-item__content .item__content__title {
      font-size: 15px;
    }
    .toolbar .toolbar-item .toolbar-item__icon img {
      max-width: 35px;
    }
    .toolbar.toolbar
      .swiper-wrapper
      .swiper-slide:first-child
      .toolbar-item__icon
      img {
      max-height: 21px;
    }
  }
  @media only screen and (max-width: 991px) {
    .bar_chart {
      grid-template-columns: 100% !important;
    }
    .bar_chart .subtitle {
      display: none;
    }
    .wrapper_dashboard .polearea_chart .subtitle {
      display: none;
    }
    .wrapper_dashboard .polearea_chart .chart {
      margin-top: 5px;
    }
  }
  @media only screen and (max-width: 768px) {
    .polearea_chart canvas {
      max-width: 450px;
      max-height: 450px;
    }
  }
`;

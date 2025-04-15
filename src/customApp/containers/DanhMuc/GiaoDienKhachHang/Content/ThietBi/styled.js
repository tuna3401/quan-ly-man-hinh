import styled from "styled-components";

export const ContentTable = styled.div`
  width: 100%;
  .table-columns {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 16px; /* Khoảng cách giữa các cột */
  }
  .table-columns.two-items {
    justify-content: flex-start; /* Không sử dụng space-between khi có 2 giá trị */
  }

  .column {
    background: #3a59e533;
    flex: 1; /* Chia đều không gian cho các cột */
    max-width: 33%; /* Giới hạn tối đa chiều rộng 1/3 */
    border: 1px solid #3a59e533; /* Đường viền để phân biệt các cột */
    display: flex;
    height: 400px;
    color: #ffffffcc;
  }
  .table-columns-left {
    width: 30%;
    border-right: 1px solid #ffffff33;
  }
  .table-columns-right {
    width: 70%;
    padding: 10px;
  }
  .table-columns-content {
    display: grid;
    grid-template-columns: 150px 1fr; /* Cột đầu rộng 150px, cột sau chiếm phần còn lại */
    // align-items: center; /* Căn giữa nội dung theo chiều dọc */
    gap: 10px; /* Khoảng cách giữa các cột */
    margin-bottom: 8px; /* Khoảng cách giữa các dòng */
    white-space: nowrap; /* Ngăn xuống dòng */
    overflow: hidden; /* Ẩn phần nội dung tràn ra ngoài */
    text-overflow: ellipsis; /* Thêm dấu ba chấm "..." vào cuối nội dung bị cắt */
    max-width: 100%; /* Đảm bảo chiều rộng tối đa là 100% */
  }

  .table-columns-content strong {
    text-align: left;
  }
  .table-content {
  }
  .table-columns-top {
    border-bottom: 1px solid #ffffff33;
  }
  .table-columns-bottom {
    margin-top: 10px;
    line-height: 26px;
  }
  .custom-pagination {
    display: flex; /* Căn chỉnh các phần tử theo chiều ngang */
    justify-content: center; /* Căn giữa pagination */
    // align-items: center; /* Căn giữa theo chiều dọc */
    margin-top: 20px; /* Khoảng cách phía trên */
    gap: 8px; /* Khoảng cách giữa các phần tử pagination */
  }

  .custom-pagination .ant-pagination-item {
    border: 1px solid #ffffff1a; /* Viền nhạt */
    border-radius: 4px; /* Bo góc nhẹ */
    background-color: #ffffff1a; /* Màu nền */
  }

  .custom-pagination .ant-pagination-item:hover {
    border-color: #192168; /* Đổi màu viền khi hover */
    background-color: #192168; /* Đổi màu nền khi hover */
  }

  .custom-pagination .ant-pagination-item-active {
    border-color: #192168; /* Màu viền cho item đang được chọn */
    background-color: #192168; /* Màu nền cho item đang được chọn */
  }

  .custom-pagination .ant-pagination-prev,
  .custom-pagination .ant-pagination-next {
    border: none; /* Xóa viền cho nút trước/sau */
    font-size: 14px; /* Kích thước chữ */
    color: #ffffff; /* Màu chữ */
  }

  .custom-pagination .ant-pagination-prev:hover,
  .custom-pagination .ant-pagination-next:hover {
    color: #ffffff; /* Màu chữ khi hover */
  }
  .ant-pagination .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: #ffffff;
  }
  .anticon {
    display: inline-flex;
    // align-items: center;
    color: #c5c2c2;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .table-columns-left-top {
    height: 55px;
    padding: 10px;
  }
  .table-columns-left-img {
    height: 280px;
    padding: 5px;
    border-bottom: 1px solid #ffffff;
  }
  .table-columns-left-bottom {
    padding: 15px;
    height: 70px;
    text-align: -webkit-center;
  }
  .table-columns-left-no {
    background: #ffffff;
    height: 270px;
  }
`;
export const ContentModal = styled.div`
  .conten-group {
    display: flex;
    justify-content: space-between;
    background: #e0dfdf;
    margin: 15px 0px;
    height: 40px;
    padding: 10px;
  }
  .conten-group-left {
    display: flex;
    justify-content: space-between;
  }
  .conten-group-left-text {
    font-family: 'Poppins', sans-serif !important;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    margin-left: 30px;
  }
  .conten-group-delete {
    visibility: hidden; /* Ẩn biểu tượng Delete mặc định */
  }

  .conten-group:hover .conten-group-delete {
    visibility: visible; /* Hiển thị biểu tượng Delete khi hover */
  }
  .add-phan-loai {
    cursor: context-menu;
  }
`;
export const ContentModalPhanLoai = styled.div`
  .ant-input-outlined {
    background: #ffffff;
    border-width: 1px;
    border-style: solid;
    border-color: #d9d9d9;
    border-right: 1px solid white;
  }
  :where(.css-dev-only-do-not-override-cg4vza).ant-tooltip .ant-tooltip-inner {
    min-width: 32px;
    min-height: 32px;
    padding: 6px 8px;
    color: #fff;
    text-align: start;
    text-decoration: none;
    word-wrap: break-word;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  }
  .ant-tooltip-inner {
    background: red;
  }
`;

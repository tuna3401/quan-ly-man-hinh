import React, { useEffect, useState } from 'react';
import { Form, Space, DatePicker, Select, Upload, Row, Col, TreeSelect } from 'antd';
import {
  Button,
  Modal,
  Input,
} from '../../../../components/uielements/exportComponent';
import {
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { REQUIRED } from '../../../../settings/constants';
import moment from 'moment';
import dayjs from 'dayjs';
import './style.css';

const { Item, useForm } = Form;

export default (props) => {
  const [form] = useForm();
  const { dataEdit, loading, visible, actionmedia, DanhSachThuMuc } = props;
  useEffect(() => {
    if (dataEdit && dataEdit.ID) {
      form.setFieldsValue({
        ...dataEdit,
      });
    }
  }, [dataEdit]);

  const onOk = async (e) => {
    e.preventDefault();
    form.validateFields().then(async (values) => {
      if (fileList.length < 1) {
        message.warning('Chưa chọn file đính kèm');
        return;
      }

      // Loop through fileList and call API for each file
      for (let index = 0; index < fileList.length; index++) {
        const fileItem = fileList[index];

        // Determine file type
        const isImage = fileItem.file.type.startsWith('image/');
        const isPDF = fileItem.file.type === 'application/pdf';
        const isPPTX = fileItem.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
          fileItem.file.type === 'application/vnd.ms-powerpoint';

        let fileType;
        if (isImage) {
          fileType = 1;
        } else if (isPDF) {
          fileType = 3;
        } else if (isPPTX) {
          fileType = 4;
        } else {
          fileType = 2; // Video
        }

        const newValue = {
          ...values,
          TenFile: fileItem.TenFile || fileItem.TenFilegoc,
          Loai: fileType,
          ThoiLuongTrinhChieu: "00:10:10",
          KichThuoc: formatFileSize(fileItem.file.size),
          TrangThai: true,
          Tag: fileItem.ListTag,
        };

        try {
          const { onCreate } = props;
          await onCreate(newValue, fileItem.file);
          // Handle success (optional): you can show a success message, update UI, etc.
        } catch (error) {
          // Handle error: you can show an error message, handle retry logic, etc.
          console.error(`Failed to upload file ${fileItem.file.name}:`, error);
        }
      }

      // Optional: After all files are processed, you can perform additional actions if needed
      // For example, clear fileList and reset form
      setFileList([]);
      form.resetFields();
    });
  };
  const onone = async (index) => {
    form.validateFields().then((values) => {
      if (fileList.length < 1) {
        message.destroy();
        message.warning('Chưa chọn file đính kèm');
        return;
      }
      const fileItem = fileList[index];

      // Determine file type
      const isImage = fileItem.file.type.startsWith('image/');
      const isPDF = fileItem.file.type === 'application/pdf';
      const isPPTX = fileItem.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        fileItem.file.type === 'application/vnd.ms-powerpoint';

      let fileType;
      if (isImage) {
        fileType = 1;
      } else if (isPDF) {
        fileType = 3;
      } else if (isPPTX) {
        fileType = 4;
      } else {
        fileType = 2; // Video
      }

      const newValue = {
        ...values,
        TenFile: fileItem.TenFile || fileItem.TenFilegoc,
        Loai: fileType,
        ThoiLuongTrinhChieu: "00:10:10",
        KichThuoc: formatFileSize(fileItem.file.size),
        Tag: fileItem.ListTag,
      };
      const { onCreate } = props;
      onCreate(newValue, fileList[index].file);
      handleCancelFile(index);
    });
  };

  const [fileList, setFileList] = useState([]);
  const handleUpload = (event) => {
    const files = Array.from(event.target.files).map((file) => ({
      file,
      id: `${file.name}-${file.lastModified}`,
      TenFilegoc: file.name,
      ListTag: '',
    }));

    setFileList([...fileList, ...files]);

    // Log tên của từng file vào console
    files.forEach((file) => {
    });
  };


  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCancelUpload = () => {
    setFileList([]);
    form.resetFields();
  };

  const handleCancelFile = (index) => {
    const updatedFileList = [...fileList];
    updatedFileList.splice(index, 1);
    setFileList(updatedFileList);
  };
  const generateTreeSelectData = (data) => {
    return data.map(item => ({
      title: item.TenThuMuc,
      value: item.ThuMucID.toString(), // Ensure value is string
      key: item.ThuMucID.toString(), // Ensure key is string
      children: item.Children.length > 0 ? generateTreeSelectData(item.Children) : undefined,
    }));
  };

  const treeSelectData = generateTreeSelectData(DanhSachThuMuc);

  return (
    <Modal
      title={`${actionmedia === 'edit' ? 'Sửa' : 'Thêm mới'} Media`}
      width={'80%'}
      visible={visible}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          Hủy
        </Button>,
        <Button
          key="back"
          // htmlType="submit"
          // type="primary"
          // form="formDiSanTuLieu"
          // loading={loading}
          onClick={props.onCancel}
          style={{
            color: 'white',
            background: 'rgb(22,119,255)',
            border: '1px solid rgb(22,119,255)',
            borderRadius: '5px',
          }}
        >
          Hoàn tất
        </Button>,
      ]}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <div style={{ color: 'red', fontSize: '20px', fontFamily: 'Poppins, sans-serif' }}>
          Chú ý: Mỗi tệp đính kèm có dung lượng tối đa 300M
        </div>
        <div>
          <input
            type="file"
            multiple
            style={{ display: 'none' }}
            id="fileInput"
            onChange={handleUpload}
          />
          <Button
            style={{
              color: 'white',
              background: 'rgb(40,167,69)',
              border: '1px solid rgb(40,167,69)',
              borderRadius: '5px',
              marginRight: '15px',
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <PlusOutlined /> Thêm tệp
          </Button>
          <Button
            style={{
              color: 'white',
              background: 'rgb(51,122,183)',
              border: '1px solid rgb(51,122,183)',
              borderRadius: '5px',
              marginRight: '15px',
            }}
            onClick={onOk}
          >
            <UploadOutlined />
            Tải lên tất cả
          </Button>
          <Button
            style={{
              color: 'white',
              background: 'rgb(255,193,7)',
              border: '1px solid rgb(255,193,7)',
              borderRadius: '5px',
              marginRight: '15px',
            }}
            onClick={handleCancelUpload}
          >
            <StopOutlined style={{ color: 'black' }} />
            Hủy tải lên
          </Button>
          <Button
            style={{
              color: 'white',
              background: 'rgb(22,119,255)',
              border: '1px solid rgb(22,119,255)',
              borderRadius: '5px',
            }}
            onClick={props.onCancel}
          >
            <CheckCircleOutlined />
            Hoàn tất
          </Button>
        </div>
      </div>

      <Form form={form} name={'formDiSanTuLieu'}>
        {actionmedia !== 'add' && <Item name="ID" hidden {...REQUIRED}></Item>}
        <Item
          label="Chọn thư mục"
          name={'ThuMucID'}
          rules={[REQUIRED]}
        >
          <TreeSelect
            treeData={treeSelectData}
            placeholder="Chọn thư mục"
            style={{ width: "30%" }}
            treeDefaultExpandAll
            onChange={(value) => form.setFieldsValue({ ThuMucID: value })}
          />
        </Item>
        <Row
          gutter={[20, 20]}
          style={{
            border: '1px solid rgb(230,237,242)',
          }}
        >
          {fileList.map((fileItem, index) => (
            <React.Fragment key={fileItem.id}>
              <Col
                span={3}
                className={index % 2 === 0 ? 'odd-row' : 'even-row'}
              >
                <Item>
                  <div>
                    {fileItem.file.type.startsWith('image/') ? (
                      <img
                        style={{
                          width: '100px',
                          height: '120px',
                          objectFit: 'cover',
                          marginTop: '5px',
                        }}
                        src={URL.createObjectURL(fileItem.file)}
                        alt={fileItem.file.name}
                      />
                    ) : fileItem.file.type === 'application/pdf' ? (
                      <div
                        style={{
                          width: '100px',
                          height: '120px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          marginTop: '5px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '40px', color: '#ff4d4f' }}>📄</div>
                          <div style={{ fontSize: '10px', color: '#666' }}>PDF</div>
                        </div>
                      </div>
                    ) : fileItem.file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                      fileItem.file.type === 'application/vnd.ms-powerpoint' ? (
                      <div
                        style={{
                          width: '100px',
                          height: '120px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          marginTop: '5px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '40px', color: '#ff6b35' }}>📊</div>
                          <div style={{ fontSize: '10px', color: '#666' }}>PPTX</div>
                        </div>
                      </div>
                    ) : (
                      <video
                        style={{
                          width: '100px',
                          height: '120px',
                          objectFit: 'cover',
                          marginTop: '5px',
                        }}
                        src={URL.createObjectURL(fileItem.file)}
                        controls
                      />
                    )}
                  </div>
                </Item>
              </Col>
              <Col
                span={7}
                className={index % 2 === 0 ? 'odd-row' : 'even-row'}
              >
                <Item label="Tên">
                  <Input
                    value={fileItem.TenFile}

                  />
                </Item>
              </Col>
              <Col
                span={7}
                className={index % 2 === 0 ? 'odd-row' : 'even-row'}
              >
                <Item label="ListTag">
                  <Input
                    value={fileItem.ListTag}

                  />
                </Item>
              </Col>
              <div className={index % 2 === 0 ? 'odd-row' : 'even-row'}>
                <div key={`file-info-${fileItem.id}`}>
                  <div >
                    <span>{formatFileSize(fileItem.file.size)} </span>
                    <span style={{ display: 'inline-flex', float: "right", marginRight: "50px" }}>
                      <UploadOutlined
                        style={{
                          color: 'white',
                          background: 'rgb(51,122,183)',
                          border: '1px solid rgb(51,122,183)',
                          borderRadius: '5px',
                          paddingLeft: '5px',
                          height: '30px',
                          width: '30px',

                        }}
                        onClick={() => onone(index)}
                      />{' '}
                      <StopOutlined
                        style={{
                          color: 'black',
                          background: 'rgb(255,193,7)',
                          border: '1px solid rgb(255,193,7)',
                          borderRadius: '5px',
                          paddingLeft: '5px',
                          height: '30px',
                          width: '30px',
                          marginLeft: '5px',
                        }}
                        onClick={() => handleCancelFile(index)}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

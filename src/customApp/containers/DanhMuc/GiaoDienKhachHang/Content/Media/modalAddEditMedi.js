import React, { useEffect, useState } from 'react';
import {
  Form,
  Space,
  DatePicker,
  Select,
  Upload,
  Row,
  Col,
  TreeSelect,
  Spin,
  message,
} from 'antd';
import { Modal as ModalAnt } from 'antd';
import {
  Button,
  Modal,
  Input,
} from '../../../../../../components/uielements/exportComponent';
import {
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { REQUIRED } from '../../../../../../settings/constants';
import moment from 'moment';
import dayjs from 'dayjs';
import './style.css';
const { Item, useForm } = Form;

export default (props) => {
  const [form] = useForm();
  const { dataEdit, visible, actionmedia, DanhSachThuMuc, Statuss, setStatuss } =
    props;
  useEffect(() => {
    if (dataEdit && dataEdit.ID) {
      form.setFieldsValue({
        ...dataEdit,
      });
    }
  }, [dataEdit]);
  useEffect(
    () => {
      if (Statuss === 1) {
        handleCancelUpload();
        setStatuss(null);
        setLoading(false);
      }
    },
    [Statuss],
    setStatuss,
  );
  useEffect(
    () => {
      if (Statuss === 1) {
        fileList.forEach((fileItem, index) => {
          handleCancelFile(index);
        });
        setStatuss(null);
        setLoading(false);

      }
    },
    [Statuss],
    setStatuss,
  );
  const [loading, setLoading] = useState(false);
  const onOk = async (e) => {
    setLoading(true);
    e.preventDefault();
    form.validateFields().then(async (values) => {
      if (fileList.length < 1) {
        message.warning('Chưa chọn file đính kèm');
        return;
      }
      const maxSize = 300 * 1024 * 1024; // 300MB in bytes
      for (let index = 0; index < fileList.length; index++) {
        const fileItem = fileList[index];
        if (fileItem.file.size > maxSize) {
          message.warning(
            `File ${fileItem.file.name} vượt quá kích thước 300MB`,
          );
          continue;
        }
        try {
          const isImage = fileItem.file.type.startsWith('image/');
          const durationInSeconds = isImage
            ? 60
            : await getVideoDuration(fileItem.file);
          const formattedDuration = isImage
            ? '00:01:00'
            : formatTime(durationInSeconds);
          const newValue = {
            ...values,
            TenFile: fileItem.TenFile || fileItem.TenFilegoc,
            Loai: isImage ? '1' : '2',
            ThoiLuongTrinhChieu: formattedDuration,
            KichThuoc: formatFileSize(fileItem.file.size),
            TrangThai: true,
            Tag: fileItem.ListTag,
          };
          const { onCreate } = props;
          await onCreate(newValue, fileItem.file);
        } catch (error) {
          console.error(`Failed to upload file ${fileItem.file.name}:`, error);
        }
      }
    });
  };
  const onone = async (e) => {
    e.preventDefault();
    form.validateFields().then(async (values) => {
      if (fileList.length < 1) {
        message.destroy();
        message.warning('Chưa chọn file đính kèm');
        return;
      }

      const index = 0;
      const fileItem = fileList[index];

      try {
        // Kiểm tra loại file và lấy thời lượng tương ứng
        const isImage = fileItem.file.type.startsWith('image/');
        const durationInSeconds = isImage
          ? 60
          : await getVideoDuration(fileItem.file);
        const formattedDuration = isImage
          ? '00:01:00'
          : formatTime(durationInSeconds);

        const newValue = {
          ...values,
          TenFile: fileItem.TenFile || fileItem.TenFilegoc,
          Loai: isImage ? '1' : '2',
          ThoiLuongTrinhChieu: formattedDuration,
          KichThuoc: formatFileSize(fileItem.file.size),
          TrangThai: true,
          Tag: fileItem.ListTag,
        };

        const { onCreate } = props;
        await onCreate(newValue, fileList[index].file);
        // handleCancelFile(index);
        setLoading(true);
      } catch (error) {
        console.error(`Failed to upload file ${fileItem.file.name}:`, error);
      }
    });
  };
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = (error) => {
        reject(error);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const [fileList, setFileList] = useState([]);
  const handleUpload = (event) => {
    const maxSize = 300 * 1024 * 1024; // 300MB in bytes
    const files = Array.from(event.target.files)
      .map((file) => {
        if (file.size > maxSize) {
          message.warning(`File ${file.name} vượt quá kích thước 300MB`);
          return null;
        }
        return {
          file,
          id: `${file.name}-${file.lastModified}`,
          TenFilegoc: file.name,
          ListTag: '',
          duration: null,
        };
      })
      .filter((file) => file !== null); // Filter out null values from the array

    setFileList([...fileList, ...files]);

    files.forEach((file) => {
      if (file) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          file.duration = video.duration;
          // Cập nhật state hoặc làm các xử lý khác tại đây
        };
        video.src = URL.createObjectURL(file.file);
      }
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

    // Clear the input file element's value
    document.getElementById('fileInput').value = null;
  };
  const handleCancelFile = (index) => {
    const updatedFileList = [...fileList];
    updatedFileList.splice(index, 1);
    setFileList(updatedFileList);

    // Clear the input file element's value
    document.getElementById('fileInput').value = null;
  };
  const handleInputChange = (index, field, value) => {
    const updatedFileList = [...fileList];
    updatedFileList[index][field] = value;
    setFileList(updatedFileList);

    // If field is 'TenFile' and its value is empty, fallback to TenFilegoc
    // if (field === 'TenFile' && value === '') {
    //   updatedFileList[index]['TenFile'] = updatedFileList[index]['TenFilegoc'];
    //   setFileList(updatedFileList);
    // }
  };
  const generateTreeSelectData = (data) => {
    return data.map((item) => ({
      title: item.TenThuMuc,
      value: item.ThuMucID.toString(), // Ensure value is string
      key: item.ThuMucID.toString(), // Ensure key is string
      children:
        item.Children.length > 0
          ? generateTreeSelectData(item.Children)
          : undefined,
    }));
  };

  const treeSelectData = generateTreeSelectData(DanhSachThuMuc);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const handleCancelModal = () => {
    ModalAnt.confirm({
      title: 'Hoàn tất',
      content: 'Bạn có chắc chắn muốn hoàn tất thêm mới media này không?',
      cancelText: 'Không',
      okText: 'Có',
      onOk: () => {
        props.onCancel();
      },
    });
  };
  const handleCancel = () => {
    ModalAnt.confirm({
      title: 'Hủy',
      content: 'Bạn có chắc chắn muốn hủy thêm mới media này không?',
      cancelText: 'Không',
      okText: 'Có',
      okButtonProps: {
        style: {
          backgroundColor: "rgb(22, 119, 255)",
          borderColor: "rgb(22, 119, 255)",
          color: "white",
        },
      },
      onOk: () => {
        props.onCancel();
      },
    });
  };
  return (
    <Modal
      title={`${actionmedia === 'edit' ? 'Sửa' : 'Thêm mới'} Media`}
      width={'80%'}
      visible={visible}
      onCancel={handleCancel}
      maskClosable={false}
      footer={[
        <Button
          key="back"
          // htmlType="submit"
          // type="primary"
          // form="formDiSanTuLieu"
          // loading={loading}
          onClick={handleCancelModal}
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
          Chú ý: Mỗi tệp đính kèm có dung lượng tối đa 300MB
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
            Thêm tệp
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
            Hủy tải lên
          </Button>
          <Button
            style={{
              color: 'white',
              background: 'rgb(22,119,255)',
              border: '1px solid rgb(22,119,255)',
              borderRadius: '5px',
            }}
            onClick={handleCancelModal}
          >
            Hoàn tất
          </Button>
        </div>
      </div>

      <Form form={form} name={'formDiSanTuLieu'}>
        {actionmedia !== 'add' && <Item name="ID" hidden {...REQUIRED}></Item>}
        <Item label="Chọn thư mục" name={'ThuMucID'} rules={[REQUIRED]}>
          <TreeSelect
            treeData={treeSelectData}
            placeholder="Chọn thư mục"
            style={{ width: '30%' }}
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
                    onChange={(e) =>
                      handleInputChange(index, 'TenFile', e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange(index, 'ListTag', e.target.value)
                    }
                  />
                </Item>
              </Col>
              <div className={index % 2 === 0 ? 'odd-row' : 'even-row'}>
                <div key={`file-info-${fileItem.id}`}>
                  <div>
                    <span>{formatFileSize(fileItem.file.size)} </span>
                    <div>{loading && <Spin />}</div>
                    <span
                      style={{
                        display: 'inline-flex',
                        float: 'right',
                        marginRight: '50px',
                      }}
                    >
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
                        onClick={onone}
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

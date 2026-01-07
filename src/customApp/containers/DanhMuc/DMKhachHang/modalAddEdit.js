import React, { Component, useEffect, useState } from 'react';
import {
  MODAL_NORMAL,
  ITEM_LAYOUT,
  REQUIRED,
} from '../../../../settings/constants';
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Select,
  Radio,
  Modal as ModalAnt,
} from 'antd';
import { Option } from '../../../../components/uielements/select';
import Modal from '../../../../components/uielements/modal';
import { getValueConfigLocalByKey } from '../../../../helpers/utility';
import { useDispatch, useSelector } from 'react-redux';
import api from './config';

const { Item } = Form;
export default (props) => {
  const [loading, setLoading] = useState(false);
  const [ListFileDinhKem, setListFileDinhKem] = useState([]);
  const { ListSideBar } = useSelector((state) => state.ListSideBar);
  const { useForm } = Form;
  const [form] = useForm();
  const dispatch = useDispatch();
  const { dataEdit } = props;
  useEffect(() => {
  }, []);
  useEffect(() => {
    if (dataEdit && dataEdit.CoQuanID) {
      form &&
        form.setFieldsValue({
          ...dataEdit,
        });
      if (dataEdit?.TenFileGoc) {
        const file = {
          TenFileGoc: dataEdit?.TenFileGoc,
          FileUrl: dataEdit?.UrlFile,
        };
        setListFileDinhKem([file]);
      }
    }
  }, []);
  const onOk = (e) => {
    e.preventDefault();
    form.validateFields().then((value) => {
      const newValue = {
        ...value,
        TenFileGoc: ListFileDinhKem.length > 0 ? ListFileDinhKem[0].name : null,
      };
      const { onCreate } = props;
      onCreate(newValue, ListFileDinhKem.length > 0 ? ListFileDinhKem[0] : null);
    });
  };

  const getBase64 = (file, callback, listFile) => {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      callback(reader.result, file, listFile),
    );
    reader.readAsDataURL(file);
  };

  const genDataFileDinhKem = (base64, file, listFile) => {
    const newListFileDinhKem = [...listFile];
    setListFileDinhKem(newListFileDinhKem);
  };
  const beforeUploadFile = (file, callback, listFile) => {
    const FileLimit = getValueConfigLocalByKey('data_config')?.fileLimit;
    const isLt2M = file.size / 1024 / 1024 < FileLimit;
    const ListFileExist = [];
    listFile?.forEach((file) => {
      const ExistFile = ListFileDinhKem.filter(
        (item) => item.TenFileGoc === file.name,
      );
      if (ExistFile.length) {
        ListFileExist.push(file);
      }
    });
    if (!isLt2M) {
      message.error(`File đính kèm phải nhỏ hơn ${FileLimit}MB`);
    } else {
      getBase64(file, callback, listFile);
    }
    return false;
  };
  const { visible, action } = props;
  const [inputError, setInputError] = useState(false);

  const handleChange = (e) => {
    const regex = /^[a-zA-Z0-9-_]*$/;
    const { value } = e.target;
    if (!regex.test(value)) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
      })
      .catch(errorInfo => {
      });
  };

  return (
    <Modal
      title={`${action === 'edit' ? 'Cập nhật' : 'Thêm'} thông tin khách hàng`}
      width={450}
      visible={visible}
      onCancel={props.onCancel}
      footer={[
        <Button key="back" onClick={props.onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          form="FormNgheNhan"
          loading={loading}
          onClick={onOk}
        // disabled={isFormSuccess}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} name={'FormNgheNhan'}>
        {action === 'edit' ? <Item name={'CoQuanID'} hidden /> : ''}
        <Item
          label="Tên khách hàng"
          name={'TenCoQuan'}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Input />
        </Item>
        <Item
          label="Địa chỉ"
          name={'DiaChi'}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Input />
        </Item>
        <Item
          label="Số điện thoại"
          name={'DienThoai'}
          {...ITEM_LAYOUT}
        // rules={[REQUIRED]}
        >
          <Input />
        </Item>
        <Item
          label="Email"
          name={'Email'}
          {...ITEM_LAYOUT}
        // rules={[REQUIRED]}
        >
          <Input />
        </Item>
        <Item
          label="Trạng thái"
          name={'IsStatus'}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Select>
            <Option value={true}>Triển khai</Option>
            <Option value={false}>Không triển khai</Option>

          </Select>
        </Item>
        <Item
          label="Mã cơ quan"
          name="MaCQ"
          {...ITEM_LAYOUT}
          rules={[
            REQUIRED,
            () => ({
              validator(_, value) {
                if (!inputError) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Chỉ được nhập số và chữ không dấu, không sử dụng dấu cách.'));
              },
            }),
          ]}
        >
          <Input onChange={handleChange} />
        </Item>
        <Item
          label="CMSAddress"
          name={'CMSAddress'}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Input />
        </Item>
        {/* <Item
          label="ClientSecret"
          name={'ClientSecret'}
          {...ITEM_LAYOUT}
          rules={[REQUIRED]}
        >
          <Input />
        </Item> */}
        <Item label="Logo khách hàng" {...ITEM_LAYOUT} rules={[REQUIRED]}>
          <Upload
            showUploadList={false}
            actions={false}
            beforeUpload={(file, listFile) => {
              beforeUploadFile(file, genDataFileDinhKem, listFile);
            }}
            disabled={loading}
          >
            <Button type={'primary'} loading={loading} className="btn-upload">
              Chọn file từ liệu từ máy tính
            </Button>
          </Upload>
          {ListFileDinhKem && ListFileDinhKem?.length
            ? ListFileDinhKem.map((item) => (
              <p key={item?.name || item?.TenFileGoc || `file-${Math.random()}`}>
                <a target="_bank" href={item?.FileUrl}>
                  {item?.name || item?.TenFileGoc}
                </a>
              </p>
            ))
            : ''}
        </Item>
      </Form>
    </Modal>
  );
};

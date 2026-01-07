import React from 'react';
import styled from 'styled-components';
import { Button, Tooltip } from 'antd';
import { CameraOutlined, DeleteOutlined, EditOutlined, DesktopOutlined } from '@ant-design/icons';
import moment from 'moment';

const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  color: #333;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    border-color: #d9d9d9;
  }

  .card-header {
    background-color: #fafafa;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    font-size: 13px;

    .time-info {
        color: #888;
        font-weight: 500;
    }

    .device-name {
        font-weight: bold;
        font-size: 15px;
        color: #333;
    }

    .header-actions {
        color: #666;
    }
  }

  .card-body {
    padding: 16px;
    display: flex;
    gap: 16px;
    
    .left-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .image-placeholder {
            width: 100%;
            aspect-ratio: 9/16;
            background-color: #f5f5f5;
            border: 1px solid #d9d9d9;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            font-size: 40px;
            border-radius: 4px;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 4px;
            }
        }

        .camera-btn {
            width: 100%;
            background: #fff;
            border: 1px solid #d9d9d9;
            color: #666;
            border-radius: 6px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                border-color: #1890ff;
                color: #1890ff;
                background: #e6f7ff;
            }
            
            .anticon {
                font-size: 20px;
            }
        }
    }

    .right-section {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 13px;

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 4px;

            &:last-child {
                border-bottom: none;
            }

            .label {
                color: #666;
                min-width: 100px;
            }

            .value {
                color: #333;
                text-align: right;
                font-weight: 500;
                word-break: break-all;
                
                &.active {
                    color: #52c41a; /* AntD Success Green */
                }
                &.inactive {
                    color: #ff4d4f; /* AntD Error Red */
                }
            }
        }
    }
  }

  .card-footer {
    padding: 10px 16px;
    background-color: #fafafa;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    .action-btn {
        color: #666;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
            background: #e6f7ff;
            color: #1890ff;
        }

        &.delete:hover {
            color: #ff4d4f;
            background: #fff1f0;
        }
    }
  }
`;

const DeviceCard = ({ data, onEdit, onDelete }) => {
    const isActive = data.TrangThai; // Assuming boolean

    // Generate placeholder fake data if real data is missing (as per user request "hãy làm cho tôi xem nào")
    const ramUsage = data.Ram || '4GB';
    const ssdUsage = data.HDD || '128GB'; // HDD from API usually
    const temp = data.NhietDo || '45°C';

    return (
        <CardWrapper>
            <div className="card-header">
                <span className="time-info">{moment().format('HH:mm DD/MM/YYYY')}</span>
                <span className="device-name">{data.TenManHinh}</span>
                <div className="header-actions">
                    {/* Placeholder for bookmark or other icons if needed */}
                </div>
            </div>

            <div className="card-body">
                <div className="left-section">
                    <div className="image-placeholder">
                        {/* If HinhAnh exists use it, otherwise icon */}
                        {data.HinhAnh ? <img src={data.HinhAnh} alt="preview" /> : <DesktopOutlined />}
                    </div>
                    <div className="camera-btn">
                        <CameraOutlined />
                    </div>
                </div>

                <div className="right-section">
                    <div className="info-row">
                        <span className="label">Hardwarekey:</span>
                        <span className="value">{data.HardwareKey || '---'}</span>
                    </div>
                    <div className="info-row">
                        {/* Assuming DiaChi is available or derived */}
                        <span className="label">Địa chỉ:</span>
                        <span className="value">{data.DiaChiMac || '---'}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Trạng thái:</span>
                        <span className={`value ${isActive ? 'active' : 'inactive'}`}>
                            {isActive ? 'Hoạt động' : 'Tạm ngừng'}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="label">Địa chỉ mac:</span>
                        <span className="value">{data.DiaChiMac || '---'}</span>
                    </div>
                    {/* Hardware Stats - Styled visually similar to the reference */}
                    <div className="info-row">
                        <span className="label">Công suất:</span>
                        <span className="value">---</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Hiệu điện thế:</span>
                        <span className="value">---</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Dòng điện:</span>
                        <span className="value">---</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Nhiệt độ:</span>
                        <span className="value">{temp}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Ram:</span>
                        <span className="value">{ramUsage}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">SSD:</span>
                        <span className="value">{ssdUsage}</span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <Tooltip title="Sửa">
                    <div className="action-btn" onClick={() => onEdit(data.ManHinhID)}>
                        <EditOutlined />
                    </div>
                </Tooltip>
                <Tooltip title="Xóa">
                    <div className="action-btn delete" onClick={() => onDelete(data.ManHinhID)}>
                        <DeleteOutlined />
                    </div>
                </Tooltip>
            </div>
        </CardWrapper>
    );
};

export default DeviceCard;

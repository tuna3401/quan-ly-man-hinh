import React from "react";
import { Tooltip, Space } from "antd";
import {
  Button,
  Modal,
  InputFormatSpecific,
  Input,
  Radio,
} from "../../../../components/uielements/exportComponent";
import {
  EditOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const ScheduleDetailModal = ({
  visible,
  onCancel,
  scheduleDetail,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  // Handle edit button click
  const handleEdit = (eventData) => {
    onCancel(); // Close the modal
    if (onEdit && eventData.LichPhatID) {
      onEdit(eventData.LichPhatID);
    }
  };

  // Handle delete button click
  const handleDelete = (eventData) => {
    onCancel(); // Close the modal
    if (onDelete && eventData.LichPhatID) {
      onDelete(eventData.LichPhatID);
    }
  };

  // Handle toggle status button click
  const handleToggleStatus = (eventData) => {
    if (onToggleStatus && eventData.LichPhatID) {
      onToggleStatus(eventData.LichPhatID, eventData.TrangThai);
    }
  };

  // Render event items
  const renderEventItems = () => {
    if (!scheduleDetail?.events || scheduleDetail.events.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          Không có sự kiện nào
        </div>
      );
    }

    return scheduleDetail.events.map((event, index) => (
      <div
        key={index}
        className="event-item p-3 mb-3 rounded-md"
        style={{
          backgroundColor: event.color + "15",
          borderLeft: `4px solid ${event.color}`,
        }}
      >
        <div className="flex justify-between items-start">
          <h4 className="text-base font-medium mb-1">{event.title}</h4>
          <span className="text-sm text-gray-600">{event.time}</span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Loại: </span>
          {event.eventType}
        </div>
        {event.contentName && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Nội dung: </span>
            {event.contentName}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Space>
            <Tooltip
              title={event.eventData?.TrangThai ? "Tạm dừng" : "Kích hoạt"}
            >
              <Button
                type="text"
                icon={
                  event.eventData?.TrangThai ? (
                    <PauseCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )
                }
                onClick={() => handleToggleStatus(event.eventData)}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(event.eventData)}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(event.eventData)}
              />
            </Tooltip>
          </Space>
        </div>
      </div>
    ));
  };

  return (
    <Modal
      title={<h3 className="text-lg font-semibold">{scheduleDetail?.title}</h3>}
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={600}
    >
      <div className="schedule-events">{renderEventItems()}</div>
    </Modal>
  );
};

export default ScheduleDetailModal;

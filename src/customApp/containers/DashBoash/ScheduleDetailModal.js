import React from "react";
import { Modal } from "../../../components/uielements/exportComponent";

const ScheduleDetailModal = ({ visible, onCancel, schedule }) => {
  return (
    <Modal
      title={
        <h2 className="m-0 text-xl font-semibold text-gray-800">
          {schedule.title}
        </h2>
      }
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={700}
      bodyStyle={{ padding: "25px" }}
    >
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-gray-600">Ngày: {schedule.date}</p>
      </div>

      <div className="space-y-4">
        {schedule.events.map((event, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{ borderLeftWidth: "4px", borderLeftColor: event.color }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{event.title}</h3>
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${event.color}20`,
                  color: event.color,
                }}
              >
                {event.eventType || "Lịch phát"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="flex items-center text-gray-600">
                <i className="far fa-clock mr-2"></i>
                <span>{event.time}</span>
              </div>

              {event.contentName && (
                <div className="flex items-center text-gray-600">
                  <i className="far fa-file-alt mr-2"></i>
                  <span>Nội dung: {event.contentName}</span>
                </div>
              )}

              {event.eventData?.TenCoQuan && (
                <div className="flex items-center text-gray-600">
                  <i className="far fa-building mr-2"></i>
                  <span>Cơ quan: {event.eventData.TenCoQuan}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {schedule.events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không có lịch phát nào trong ngày này
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ScheduleDetailModal;

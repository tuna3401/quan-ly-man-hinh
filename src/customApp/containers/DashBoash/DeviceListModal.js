import React from "react";
import { Spin } from "antd";
import { Modal } from "../../../components/uielements/exportComponent";
import {
  FaHdd,
  FaMapMarkedAlt,
  FaMemory,
  FaThermometerHalf,
} from "react-icons/fa";

const DeviceListModal = ({
  visible,
  onCancel,
  title,
  devices = [],
  onViewDeviceDetail,
  isLoading,
}) => {
  return (
    <Modal
      title={<h2 className="m-0 text-xl font-semibold ">{title}</h2>}
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={800}
      bodyStyle={{ padding: "25px" }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Đang tải danh sách thiết bị..." />
        </div>
      ) : (
        <div
          className="grid gap-5 p-1"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {devices.map((device, index) => {
            // Define status variables once to avoid repetition
            const isActive = device.DeviceStatus === 1;
            const isPaused = device.DeviceStatus === 2;
            const isExpired = device.DeviceStatus === 3;

            // Define colors and text based on status
            const borderColor = isActive
              ? "#4CAF50"
              : isPaused
              ? "#FF9800"
              : isExpired
              ? "#F44336"
              : "#CCCCCC";
            const bgColorClass = isActive
              ? "bg-green-500"
              : isPaused
              ? "bg-orange-500"
              : isExpired
              ? "bg-red-500"
              : "bg-gray-500";
            const textColorClass = isActive
              ? "text-green-500"
              : isPaused
              ? "text-orange-500"
              : isExpired
              ? "text-red-500"
              : "text-gray-500";
            const statusText = isActive
              ? "Hoạt động"
              : isPaused
              ? "Tạm dừng"
              : isExpired
              ? "Hết hạn"
              : "Không xác định";

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => onViewDeviceDetail(device.ManHinhID)}
              >
                {/* Device card content */}
                <div
                  className="border-l-4 px-4 py-3"
                  style={{ borderLeftColor: borderColor }}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${bgColorClass}`}
                    ></div>
                    <span className={`text-sm ${textColorClass}`}>
                      {statusText}
                    </span>
                  </div>

                  <h3 className="font-medium text-lg mb-2">{device.name}</h3>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <FaThermometerHalf className="text-blue-500 mr-2" />
                      <span>{device.temperature || "38°C"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMemory className="text-purple-500 mr-2" />
                      <span>{device.ram || "4GB"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaHdd className="text-teal-500 mr-2" />
                      <span>{device.storage || "32GB"}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mt-3">
                    <FaMapMarkedAlt className="text-red-500 mr-2" />
                    <span className="truncate">{device.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {devices.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Không có thiết bị nào
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default DeviceListModal;

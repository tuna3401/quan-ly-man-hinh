import React from "react";
import { Modal } from "../../../components/uielements/exportComponent";
import {
  FaBarcode,
  FaBookmark,
  FaBug,
  FaCamera,
  FaDesktop,
  FaHashtag,
  FaHdd,
  FaMapMarked,
  FaMemory,
  FaMobile,
  FaNetworkWired,
  FaPlay,
  FaPlug,
  FaPowerOff,
  FaRedo,
  FaThermometerHalf,
} from "react-icons/fa";
import Button from "../../../components/uielements/button";
import { message } from "antd";
import apiThietBi from "../DanhMuc/GiaoDienKhachHang/Content/ThietBi/config";

const DeviceDetailModal = ({ visible, onCancel, device }) => {
  // Define status variables once to avoid repetition
  const isActive = device.DeviceStatus === 1;
  const isPaused = device.DeviceStatus === 2;
  const isExpired = device.DeviceStatus === 3;
  const isUnknown =
    device.DeviceStatus === 0 || device.DeviceStatus === undefined;

  // Define colors and text based on status
  const statusBgClass = isActive
    ? "bg-green-100 text-green-500"
    : isPaused
    ? "bg-orange-100 text-orange-500"
    : isExpired
    ? "bg-red-100 text-red-500"
    : "bg-gray-100 text-gray-500";

  const statusText = isActive
    ? "Đang hoạt động"
    : isPaused
    ? "Tạm dừng"
    : isExpired
    ? "Hết hạn"
    : "Không xác định";

  // Handler for device actions
  const handleResumeDevice = () => {
    console.log("Resuming device:", device.code);
    // Implement resume device logic
  };

  const handleRestartDevice = () => {
    console.log("Restarting device:", device.code);
    // Implement restart device logic
  };

  const handleShutdownDevice = () => {
    console.log("Shutting down device:", device.code);
    // Implement shutdown device logic
  };

  const handleCaptureDevice = (HardwareKey) => {
    apiThietBi
      .ChupAnh({ HardwareKey })
      .then((response) => {
        if (response.data.Status >= 0) {
          message.destroy();
          message.success(response.data.Message);
        } else {
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        Modal.error(Constants.API_ERROR);
      });
  };

  return (
    <Modal
      title={<h2 className="m-0 text-xl font-semibold">Thông tin thiết bị</h2>}
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={800}
      bodyStyle={{ padding: "25px" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-5 border-b border-gray-200">
        <div className="flex flex-col gap-2 mb-4 md:mb-0">
          <h3 className="flex items-center gap-2.5 text-lg font-semibold text-gray-800 m-0">
            {" "}
            <FaDesktop className="text-blue-500" />
            {device.name}
          </h3>
          <div className="flex items-center gap-2.5 text-base text-gray-600">
            <FaMapMarked className="text-red-500" />
            <span className="text-sm">{device.location}</span>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium ${statusBgClass}`}
        >
          <div className="w-2 h-2 rounded-full bg-current"></div>
          {statusText}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">
          Thông số thiết bị
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaThermometerHalf className="text-blue-500" />
              <span>Nhiệt độ</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.temperature || "38°C"}
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaMemory className="text-purple-500" />
              <span>RAM</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.ram || "4GB"}
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaHdd className="text-teal-500" />
              <span>Bộ nhớ</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.storage || "32GB"}
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaBarcode className="text-blue-500" />
              <span>Mã thiết bị</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.code}
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaNetworkWired className="text-blue-500" />
              <span>Địa chỉ MAC</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.DiaChiMac}
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaBug className="text-blue-500" />
              <span>HardwareKey</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.HardwareKey}
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaBookmark className="text-blue-500" />
              <span>VersionApp</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.VersionApp}
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg hover:translate-y-[-3px] hover:shadow-md transition duration-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaPlug className="text-blue-500" />
              <span>Dòng điện</span>
            </div>
            <div className="text-base font-semibold text-gray-800">
              {device.DongDien}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-8 rounded-lg overflow-hidden shadow-md">
        {device.screenshot && (
          <img
            src={device.screenshot}
            alt="Device Screenshot"
            className="w-full h-auto"
          />
        )}
      </div>
    </Modal>
  );
};

export default DeviceDetailModal;

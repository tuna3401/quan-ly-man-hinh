import { Modal, Table, Tooltip, message, Row, Col, Spin } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import actions from "../../../redux/DanhMuc/QLLichPhat/actions";
import LayoutWrapper from "../../../../components/utility/layoutWrapper";
import PageWrap from "../../../../components/utility/PageWrap";
import PageAction from "../../../../components/utility/pageAction";
import ModalAddEdit from "./modalAddEdit";
import BoxFilter from "../../../../components/utility/boxFilter";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaDesktop,
  FaPauseCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Box from "../../../../components/utility/box";
import api from "./config";
import {
  Button,
  DatePicker,
  InputSearch,
  Option,
  Select,
} from "../../../../components/uielements/exportComponent";
import {
  changeUrlFilter,
  getFilterData,
  getRoleByKey,
} from "../../../../helpers/utility";
import { TreeSelect } from "../../../../components/uielements/exportComponent";
import { Pagination } from "antd";
import ScheduleDetailModal from "./ScheduleDetailModal";
import { useKey } from "../../../CustomHook/useKey";
import { Tabs } from "antd";
import {
  PlusOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  LeftOutlined,
  EditOutlined,
  RightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
const { TabPane } = Tabs;
import queryString from "query-string";
import dayjs from "dayjs";
const DashBoard = (props) => {
  document.title = "Dashboard";
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
  });
  const deviceStatusChartRef = useRef(null);
  const deviceGroupsChartRef = useRef(null);
  const [hideSelect, setHideSelect] = useState(false);
  // Modal states

  const [scheduleDetailModalVisible, setScheduleDetailModalVisible] =
    useState(false);
  // Modal data states
  const [deviceList, setDeviceList] = useState([]);

  const [scheduleDetail, setScheduleDetail] = useState({
    title: "",
    date: "",
    events: [],
  });

  // Calendar data
  const [calendarDays, setCalendarDays] = useState([]);
  const dispatch = useDispatch();
  // const DanhSachLoaiSuKien = props.DanhSachLoaiSuKien || [];
  // const DanhSachMediaOrPhat = props.DanhSachMediaOrPhat || [];
  // const DanhSachManHinhOrNhomManHinh = props.DanhSachManHinhOrNhomManHinh || [];
  // const DanhSachCoQuan = props.DanhSachCoQuan || [];
  const {
    dataSchedulePlayList,
    DanhSachLoaiSuKien,
    DanhSachMediaOrPhat,
    DanhSachManHinhOrNhomManHinh,
    DanhSachCoQuan,
    loading,
    TotalRow,
  } = useSelector((state) => state.QLLichPhat);

  // State variables for ModalAddEdit
  const [dataModalAddEdit, setDataModalAddEdit] = useState({});
  const [visibleModalAddEdit, setVisibleModalAddEdit] = useState(false);
  const [action, setAction] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalKey, inceaseModalKey] = useKey();
  const [activeTab, setActiveTab] = useState("0");
  const [filterData, setFilterData] = useState({
    ...queryString.parse(props.location.search),
    activeTab: "0",
  });

  // Pagination for sidebar
  const [sidebarPage, setSidebarPage] = useState(1);
  const [sidebarPageSize] = useState(5);

  useEffect(() => {
    changeUrlFilter(filterData);
    dispatch(actions.getList(filterData));
  }, [filterData]);

  const onFilter = (value, property) => {
    let oldFilterData = filterData;
    let onFilter = { value, property };
    let newfilterData = getFilterData(oldFilterData, onFilter, null);
    //get filter data
    setFilterData(newfilterData);
  };

  // Function to show modal for adding new schedule
  const showModalAdd = () => {
    setDataModalAddEdit({});
    setVisibleModalAddEdit(true);
    setAction("add");
    inceaseModalKey();
  };

  // Function to show modal for editing existing schedule
  const showModalEdit = (id) => {
    // const dataEdit = dataSchedulePlayList.find(
    //   (item) => item.LichPhatID === id
    // );
    api.chiTietNgheNhan({ LichPhatID: id }).then((response) => {
      if (response.data.Status > 0) {
        setDataModalAddEdit(response.data.Data);
        setVisibleModalAddEdit(true);
        setAction("edit");
        inceaseModalKey();
      } else {
        message.error(response.data.Message);
        message.destroy();
      }
    });
    // if (dataEdit) {
    //   setDataModalAddEdit(dataEdit);
    //   setVisibleModalAddEdit(true);
    //   setAction("edit");
    //   inceaseModalKey();
    // }
  };

  // Function to hide modal
  const hideModalAddEdit = () => {
    setVisibleModalAddEdit(false);
  };

  // Function to handle form submission
  const submitModalAddEdit = (values) => {

    setConfirmLoading(true);
    if (action === "add") {
      api
        .themNgheNhan(values)
        .then((response) => {
          if (response.data.Status > 0) {
            message.success("Thêm mới thành công");
            hideModalAddEdit();
            dispatch(actions.getList(filterData));
          } else {
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          message.error(error.toString());
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    } else {
      api
        .suaNgheNhan(values)
        .then((response) => {
          if (response.data.Status > 0) {
            message.success("Cập nhật thành công");
            hideModalAddEdit();
            dispatch(actions.getList(filterData));
          } else {
            message.error(response.data.Message);
          }
        })
        .catch((error) => {
          message.error(error.toString());
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };

  // Function to delete a schedule
  const deleteModalAddEdit = (id) => {

    Modal.confirm({
      title: "Xóa dữ liệu",
      content: "Bạn có muốn xóa lịch phát này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        api
          .xoaNgheNhan(id)
          .then((response) => {
            if (response.data.Status > 0) {
              message.success("Xóa thành công");
              dispatch(actions.getList(filterData));
            } else {
              message.error(response.data.Message);
            }
          })
          .catch((error) => {
            message.error(error.toString());
          });
      },
    });
  };

  // Function to toggle schedule status
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    api
      .capNhatTrangThai({ LichPhatID: id, TrangThai: newStatus })
      .then((response) => {
        if (response.data.Status > 0) {
          message.success(
            `Lịch phát đã được ${newStatus ? "kích hoạt" : "tạm dừng"}`
          );
          dispatch(actions.getList(filterData));
        } else {
          message.error(response.data.Message);
        }
      })
      .catch((error) => {
        message.error(error.toString());
      });
  };

  useEffect(() => {
    dispatch(actions.getInitData());
  }, []);

  useEffect(() => {
    // Initialize charts when component mounts
    if (typeof window !== "undefined" && dataSchedulePlayList) {
      // initializeCharts();
      generateCalendarData();
    }
  }, [currentMonth, dataSchedulePlayList]);

  // Generate calendar data based on current month
  const generateCalendarData = () => {
    // Parse month and year from currentMonth string
    const monthMatch = currentMonth.match(/Tháng (\d+), (\d+)/);
    if (!monthMatch || !dataSchedulePlayList || !dataSchedulePlayList) return;

    const month = parseInt(monthMatch[1], 10) - 1; // 0-based month
    const year = parseInt(monthMatch[2], 10);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: "", events: [] });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, events: [] });
    }

    // Process events from API data
    if (dataSchedulePlayList && dataSchedulePlayList.length > 0) {
      dataSchedulePlayList.forEach((event) => {
        // Determine color based on event type
        let color = "#4CAF50"; // Default green
        if (event.LoaiSuKien === 2) {
          color = "#2196F3"; // Blue for Media
        } else if (event.LoaiSuKien === 3) {
          color = "#E91E63"; // Pink for other types
        }

        if (event.ChiaNgay === true) {
          // For events with ChiaNgay = true, display on specific NgayPhat date
          if (event.NgayPhat) {
            const eventDate = new Date(event.NgayPhat);
            // Check if event is in the current month/year
            if (
              eventDate.getMonth() === month &&
              eventDate.getFullYear() === year
            ) {
              const day = eventDate.getDate();
              const dayIndex = day + startingDay - 1;

              // Add event to the day
              if (
                dayIndex >= 0 &&
                dayIndex < days.length &&
                days[dayIndex].day !== ""
              ) {
                days[dayIndex].events.push({
                  title: event.TenLichPhat,
                  time: `${event.GioBatDau?.substring(0, 5) || "00:00"} - ${event.GioKetThuc?.substring(0, 5) || "23:59"
                    }`,
                  color: color,
                  eventData: event, // Store full event data for modal
                });
              }
            }
          }
        } else {
          // For events with ChiaNgay = false, display on all days from CreatedDate to EndDate
          if (event.CreatedDate && event.EndDate) {
            const startDate = new Date(event.CreatedDate);
            const endDate = new Date(event.EndDate);

            // Current month's date range
            const currentMonthStart = new Date(year, month, 1);
            const currentMonthEnd = new Date(year, month + 1, 0);

            // Check if event period overlaps with current month
            if (startDate <= currentMonthEnd && endDate >= currentMonthStart) {
              // Calculate the range of days to display the event in current month
              const rangeStart =
                startDate > currentMonthStart ? startDate : currentMonthStart;
              const rangeEnd =
                endDate < currentMonthEnd ? endDate : currentMonthEnd;

              // Add event to all days in the range
              for (
                let date = new Date(rangeStart);
                date <= rangeEnd;
                date.setDate(date.getDate() + 1)
              ) {
                if (date.getMonth() === month && date.getFullYear() === year) {
                  const day = date.getDate();
                  const dayIndex = day + startingDay - 1;

                  if (
                    dayIndex >= 0 &&
                    dayIndex < days.length &&
                    days[dayIndex].day !== ""
                  ) {
                    days[dayIndex].events.push({
                      title: event.TenLichPhat,
                      time: `${event.GioBatDau?.substring(0, 5) || "00:00"} - ${event.GioKetThuc?.substring(0, 5) || "23:59"
                        }`,
                      color: color,
                      eventData: event, // Store full event data for modal
                    });
                  }
                }
              }
            }
          }
        }
      });
    }

    setCalendarDays(days);
  };

  // Helper function to get mock events for a specific month

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    const monthMatch = currentMonth.match(/Tháng (\d+), (\d+)/);
    if (!monthMatch) return;

    let month = parseInt(monthMatch[1], 10);
    let year = parseInt(monthMatch[2], 10);

    month--;
    if (month < 1) {
      month = 12;
      year--;
    }

    setCurrentMonth(`Tháng ${month}, ${year}`);
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    const monthMatch = currentMonth.match(/Tháng (\d+), (\d+)/);
    if (!monthMatch) return;

    let month = parseInt(monthMatch[1], 10);
    let year = parseInt(monthMatch[2], 10);

    month++;
    if (month > 12) {
      month = 1;
      year++;
    }

    setCurrentMonth(`Tháng ${month}, ${year}`);
  };

  const showScheduleDetailModal = (date, events) => {
    setScheduleDetail({
      title: `Lịch phát ngày ${date}`,
      date: date,
      events: events.map((event) => ({
        ...event,
        // Include any additional processing needed for the modal
        eventType:
          event.eventData?.LoaiSuKien === 1
            ? "Danh Sách Phát"
            : event.eventData?.LoaiSuKien === 2
              ? "Media"
              : "Khác",
        contentName: event.eventData?.TenMediaORDanhSachPhat || "",
      })),
    });
    setScheduleDetailModalVisible(true);
  };

  // Add the renderListView function
  const renderListView = () => {
    return (
      <div className="schedule-list">
        <BoxFilter hienthi={true}>
          {!hideSelect && (
            <TreeSelect
              showSearch
              treeData={DanhSachCoQuan}
              onChange={(value) => onFilter(value, "CoQuanID")}
              style={{ width: 400 }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="Chọn cơ quan"
              allowClear
              treeDefaultExpandAll
              notFoundContent={"Không có dữ liệu"}
              treeNodeFilterProp={"title"}
            />
          )}
          <Select
            allowClear
            style={{ width: "200px" }}
            defaultValue={filterData.LoaiSuKien}
            placeholder={"Loại sự kiện"}
            onChange={(value) => onFilter(value, "LoaiSuKien")}
          >
            {DanhSachLoaiSuKien?.map((item) => (
              <Option key={item.ID} value={item.ID}>
                {item.TenSuKien}
              </Option>
            ))}
          </Select>
          <Select
            allowClear
            style={{ width: "200px" }}
            defaultValue={filterData.ID}
            placeholder={"Màn hình"}
            onChange={(value, item) => {
              onFilter(value, "ID");
              const selectedItem = DanhSachManHinhOrNhomManHinh.find(
                (item) => item.ID === value
              );

              if (selectedItem && selectedItem.ID === value) {
                onFilter(1, "title");
              } else {
                onFilter(null, "title");
              }
            }}
          >
            {DanhSachManHinhOrNhomManHinh.filter(
              (item) => item.Title === 1
            ).map((item) => (
              <Option key={item.Title} value={item.ID}>
                {item.Ten}
              </Option>
            ))}
          </Select>

          <Select
            allowClear
            style={{ width: "200px" }}
            defaultValue={filterData.title}
            placeholder={"Nhóm màn hình"}
            onChange={(value, item) => {
              onFilter(value, "ID");
              const selectedItem = DanhSachManHinhOrNhomManHinh.find(
                (item) => item.ID === value
              );

              if (selectedItem && selectedItem.ID === value) {
                onFilter(2, "title");
              } else {
                onFilter(null, "title");
              }
            }}
          >
            {DanhSachManHinhOrNhomManHinh.filter(
              (item) => item.Title === 2
            ).map((item) => (
              <Option key={item.ID} value={item.ID}>
                {item.Ten}
              </Option>
            ))}
          </Select>
          <InputSearch
            defaultValue={filterData.Keyword}
            placeholder={"Nhập tên sự kiện"}
            style={{ width: 300 }}
            onSearch={(value) => onFilter(value, "Keyword")}
            allowClear
          />
        </BoxFilter>

        <div className="">
          {dataSchedulePlayList && dataSchedulePlayList.length > 0 ? (
            <div
              className="space-y-2"
              style={{ maxHeight: 500, overflow: "auto" }}
            >
              {dataSchedulePlayList.map((item, index) => {
                // Determine event type color for left border
                let eventColor = "#4CAF50"; // Default green
                if (item.LoaiSuKien === 2) {
                  eventColor = "#2196F3"; // Blue for Media
                } else if (item.LoaiSuKien === 3) {
                  eventColor = "#E91E63"; // Pink for other types
                }

                // Get device count
                const deviceCount =
                  item.ListManHinhOrNhomManHinh &&
                    item.ListManHinhOrNhomManHinh.length > 0
                    ? item.ListManHinhOrNhomManHinh.filter(
                      (device) => device.Ten !== null
                    ).length
                    : 0;
                console.log(activeTab === "1", 'activeTab === "1"');
                return (
                  activeTab === "1" && (
                    <div
                      key={item.LichPhatID || `schedule-${index}`}
                      className="bg-white rounded-sm shadow-sm overflow-hidden border-l-4"
                      style={{ borderLeftColor: eventColor }}
                    >
                      <div className="flex justify-between items-center p-3">
                        <div className="flex-grow">
                          <h3 className="text-base font-medium">
                            {item.TenLichPhat}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            {/* <span className="mr-4">
                              📅{" "}
                              {item.ChiaNgay === false ? (
                                <span>
                                  {item.CreatedDate
                                    ? dayjs(item.CreatedDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    : ""}{" "}
                                  -{" "}
                                  {item.EndDate
                                    ? dayjs(item.EndDate).format("DD/MM/YYYY")
                                    : ""}
                                </span>
                              ) : (
                                <span>
                                  {item.NgayPhat
                                    ? dayjs(item.NgayPhat).format("DD/MM/YYYY")
                                    : ""}
                                </span>
                              )}
                            </span>
                            <span className="mr-4">
                              🕒{" "}
                              {item.ChiaNgay === false ? (
                                <span>Luôn luôn</span>
                              ) : (f
                                <span>
                                  {item.GioBatDau || "00:00"} -{" "}
                                  {item.GioKetThuc || "23:59"}
                                </span>
                              )}
                            </span> */}
                            <span>📺 {deviceCount} thiết bị</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm mr-2 font-medium ${item.TrangThai ? "text-green-500" : "text-red-500"
                              }`}
                          >
                            {item.TrangThai ? "Hoạt động" : "Tạm dừng"}
                          </span>
                          <div className="flex gap-2">
                            <Tooltip title={"Sửa"}>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => showModalEdit(item.LichPhatID)}
                              />
                            </Tooltip>
                            <Tooltip title={"Xóa"}>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  deleteModalAddEdit(item.LichPhatID)
                                }
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu lịch phát
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <Pagination
            showSizeChanger
            showTotal={(total, range) =>
              `Từ ${range[0]} đến ${range[1]} trên ${total} kết quả`
            }
            total={TotalRow}
            current={props.PageNumber}
            pageSize={props.PageSize}
            onChange={(page, pageSize) => {
              const newFilterData = {
                ...filterData,
                PageNumber: page,
                PageSize: pageSize,
              };
              setFilterData(newFilterData);
            }}
          />
        </div>
      </div>
    );
  };

  const renderScheduleDetailModal = () => {
    return (
      <ScheduleDetailModal
        visible={scheduleDetailModalVisible}
        onCancel={() => setScheduleDetailModalVisible(false)}
        scheduleDetail={scheduleDetail}
        onEdit={(eventData) => {
          if (
            eventData &&
            eventData.eventData &&
            eventData.eventData.LichPhatID
          ) {
            showModalEdit(eventData.eventData.LichPhatID);
          }
        }}
        onDelete={(eventData) => {
          if (
            eventData &&
            eventData.eventData &&
            eventData.eventData.LichPhatID
          ) {
            deleteModalAddEdit(eventData.eventData.LichPhatID);
          }
        }}
        onToggleStatus={(eventData) => {
          if (
            eventData &&
            eventData.eventData &&
            eventData.eventData.LichPhatID
          ) {
            handleToggleStatus(
              eventData.eventData.LichPhatID,
              eventData.eventData.TrangThai
            );
          }
        }}
      />
    );
  };

  // Render calendar view
  const renderCalendarView = () => {
    // Filter schedules for current month
    const monthMatch = currentMonth.match(/Tháng (\d+), (\d+)/);
    const monthlySchedules = [];

    if (monthMatch && Array.isArray(dataSchedulePlayList)) {
      const month = parseInt(monthMatch[1], 10) - 1;
      const year = parseInt(monthMatch[2], 10);

      console.log('Filtering for month:', month + 1, 'year:', year);
      console.log('Total schedules:', dataSchedulePlayList.length);

      dataSchedulePlayList.forEach((event, index) => {
        let shouldInclude = false;
        let displayDate = '';

        // Debug: Log first event to see structure
        if (index === 0) {
          console.log('Sample event structure:', {
            TenLichPhat: event.TenLichPhat,
            DanhSachNgayPhats: event.DanhSachNgayPhats,
            ChiaNgay: event.ChiaNgay,
            allFields: Object.keys(event)
          });
        }

        // Check if this is an "always-on" schedule (Luôn Luôn)
        // These schedules have empty or no DanhSachNgayPhats array
        if (!event.DanhSachNgayPhats || event.DanhSachNgayPhats.length === 0) {
          shouldInclude = true;
          displayDate = 'Luôn luôn';
          console.log('Always-on schedule:', event.TenLichPhat);
        }
        // Check DanhSachNgayPhats array for dates in current month
        else if (Array.isArray(event.DanhSachNgayPhats)) {
          event.DanhSachNgayPhats.forEach((ngayPhat) => {
            const eventDate = new Date(ngayPhat.DanhSachNgayPhat);
            console.log('Checking date:', event.TenLichPhat, ngayPhat.DanhSachNgayPhat, 'Month:', eventDate.getMonth() + 1, 'Year:', eventDate.getFullYear());

            if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
              shouldInclude = true;
              displayDate = dayjs(ngayPhat.DanhSachNgayPhat).format('DD/MM');
              console.log('Matched by DanhSachNgayPhat:', event.TenLichPhat, displayDate);
            }
          });
        }

        if (shouldInclude) {
          let color = "#4CAF50";
          if (event.LoaiSuKien === 2) color = "#2196F3";
          else if (event.LoaiSuKien === 3) color = "#E91E63";

          monthlySchedules.push({ ...event, displayDate, color });
        }
      });

      console.log('Filtered schedules:', monthlySchedules.length);
    }

    return (
      <Row gutter={16} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Col xs={24} lg={14}>
          <div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="m-0 text-lg font-medium">Lịch phát trong tháng</h2>
              <div className="flex items-center gap-2.5">
                <button
                  className="bg-transparent border-0 cursor-pointer text-gray-600 text-sm w-[30px] h-[30px] rounded-full flex items-center justify-center hover:bg-gray-100"
                  onClick={goToPreviousMonth}
                >
                  <LeftOutlined />
                </button>
                <span className="text-base font-medium">{currentMonth}</span>
                <button
                  className="bg-transparent border-0 cursor-pointer text-gray-600 text-sm w-[30px] h-[30px] rounded-full flex items-center justify-center hover:bg-gray-100"
                  onClick={goToNextMonth}
                >
                  <RightOutlined />
                </button>
              </div>
            </div>
            <div className="relative p-4">
              <div className="grid grid-cols-7 gap-1 mb-1">
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  CN
                </div>
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  T2
                </div>
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  T3
                </div>
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  T4
                </div>
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  T5
                </div>
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  T6
                </div>
                <div className="p-2 text-center font-medium text-gray-700 bg-gray-50 rounded">
                  T7
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1" id="calendarGrid">
                {calendarDays.map((day, index) => (
                  <div
                    key={`day-${index}`}
                    className={`relative p-2 border border-gray-200 rounded-md min-h-[90px] ${day.day
                      ? "cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                      : "bg-gray-50/30"
                      } ${day.events.length > 0 ? "shadow-sm" : ""}`}
                    onClick={() =>
                      day.day && day.events.length > 0
                        ? showScheduleDetailModal(
                          `${day.day}/${currentMonth.match(/Tháng (\d+), (\d+)/)[1]
                          }/${currentMonth.match(/Tháng (\d+), (\d+)/)[2]}`,
                          day.events
                        )
                        : null
                    }
                  >
                    <div
                      className={`text-center font-medium ${day.day ? (index % 7 === 0 ? "" : "") : "text-gray-300"
                        }`}
                    >
                      {day.day}
                    </div>
                    {day.events.length > 0 && (
                      <div className="relative mt-2 flex flex-col gap-1">
                        {day.events.map((event, eventIndex) => (
                          <div
                            key={event.eventData?.LichPhatID || `event-${eventIndex}`}
                            className="py-1 px-2 rounded text-xs text-white cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap shadow-sm z-10 hover:brightness-110 transition-all"
                            style={{ backgroundColor: event.color }}
                          >
                            <div className="font-medium overflow-hidden text-ellipsis">
                              {event.title}
                            </div>
                            <div className="text-[10px] opacity-90">
                              {event.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Sidebar - Right Side (40%) */}
        <Col xs={24} lg={10}>
          <div className="border-l border-gray-200" style={{ minHeight: '600px' }}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="m-0 text-base font-medium flex items-center justify-between">
                <span>Danh sách lịch phát</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                  {monthlySchedules.length} lịch
                </span>
              </h3>
            </div>
            <div style={{ maxHeight: '550px', overflowY: 'auto', padding: '16px' }}>
              {monthlySchedules.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {monthlySchedules
                      .slice((sidebarPage - 1) * sidebarPageSize, sidebarPage * sidebarPageSize)
                      .map((schedule) => (
                        <div
                          key={schedule.LichPhatID}
                          className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
                          style={{ borderLeft: `4px solid ${schedule.color}` }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-xs font-medium px-2 py-1 rounded"
                                  style={{ backgroundColor: `${schedule.color}20`, color: schedule.color }}
                                >
                                  {schedule.displayDate}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${schedule.TrangThai ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                  {schedule.TrangThai ? 'Hoạt động' : 'Tạm dừng'}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium m-0 mb-1">{schedule.TenLichPhat}</h4>
                              <p className="text-xs text-gray-500 m-0">
                                {schedule.ChiaNgay
                                  ? `${schedule.GioBatDau?.substring(0, 5) || '00:00'} - ${schedule.GioKetThuc?.substring(0, 5) || '23:59'}`
                                  : 'Luôn luôn'}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Tooltip title="Sửa">
                                <Button type="text" size="small" icon={<EditOutlined />}
                                  onClick={() => showModalEdit(schedule.LichPhatID)} />
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <Button type="text" size="small" danger icon={<DeleteOutlined />}
                                  onClick={() => deleteModalAddEdit(schedule.LichPhatID)} />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {monthlySchedules.length > sidebarPageSize && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <Pagination
                        current={sidebarPage}
                        pageSize={sidebarPageSize}
                        total={monthlySchedules.length}
                        onChange={(page) => setSidebarPage(page)}
                        size="small"
                        showSizeChanger={false}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Không có lịch phát nào trong tháng này</p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row >
    );
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Update filterData to include the active tab
    const newFilterData = { ...filterData, activeTab: key };
    setFilterData(newFilterData);
  };

  return (
    <LayoutWrapper>
      <PageWrap>
        <PageAction>
          <div className="flex justify-between w-full">
            <div>
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                className="mb-0"
              >
                <TabPane
                  tab={
                    <span>
                      <UnorderedListOutlined /> Danh sách
                    </span>
                  }
                  key="1"
                ></TabPane>
                <TabPane
                  tab={
                    <span>
                      <CalendarOutlined /> Lịch
                    </span>
                  }
                  key="0"
                />
              </Tabs>
            </div>
            {activeTab === "1" ? (
              <Button type="primary" onClick={showModalAdd}>
                <PlusOutlined />
                Thêm mới
              </Button>
            ) : null}
          </div>
        </PageAction>
      </PageWrap>

      <Box>
        {/* {renderListView()} */}
        {activeTab === "1" ? (
          <div className="list-view-container">{renderListView()}</div>
        ) : (
          <div className="calendar-view-container">{renderCalendarView()}</div>
        )}
      </Box>

      <ModalAddEdit
        visible={visibleModalAddEdit}
        dataEdit={dataModalAddEdit}
        action={action}
        loading={confirmLoading}
        key={modalKey}
        onCreate={submitModalAddEdit}
        onCancel={hideModalAddEdit}
        DanhSachLoaiSuKien={DanhSachLoaiSuKien}
        DanhSachMediaOrPhat={DanhSachMediaOrPhat}
        DanhSachManHinhOrNhomManHinh={DanhSachManHinhOrNhomManHinh}
      />
    </LayoutWrapper>
  );
};

export default DashBoard;

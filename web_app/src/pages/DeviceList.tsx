import React from "react";
import { useRequest } from "ahooks";
import { getDeviceList, testInvite, closeInvite, deleteDevice, refreshDevice } from "../apis";
import { Button, Table, TableProps, Spin, Modal, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { DeviceDataType } from "../data/tableData";
import { Outlet } from "react-router-dom";

function DeviceList() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [deleteChoice, setDeleteChoice] = React.useState("");
  const { data, error, loading } = useRequest(
    async () => await getDeviceList()
  );
  
  const refresh = async (deviceId: string) => {
    try {

      const res = await refreshDevice(deviceId);
      messageApi.info("刷新成功");
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    setModalOpen(false);
    setDeleteChoice("");
  };

  const handleDelete = async (deviceId: string) => {
    setConfirmLoading(true);
    try {
      const res = await deleteDevice(deviceId);
      console.log(res);
      setModalOpen(false);
      setConfirmLoading(false);
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
    }
  }

  const openModal = (text: any, record: any) => {
    console.log(record);
    setDeleteChoice(record.deviceId);
    setModalOpen(true);
  }

  const columns: TableProps<DeviceDataType>["columns"] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "设备id",
      dataIndex: "deviceId",
      key: "deviceId",
    },
    {
      title: "设备名称",
      dataIndex: "deviceName",
      key: "deviceName",
    },
    {
      title: "通道数",
      dataIndex: "channelCount",
      key: "channelCount",
    },
    {
      title: "上次心跳",
      dataIndex: "lastPulse",
      key: "lastPulse",
    },
    {
      title: "在线状态",
      dataIndex: "onlineStatus",
      key: "onlineStatus",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => (
        <div>
          <Button onClick={() => navigate(`/device/channel?deviceId=${record.deviceId}`)}>
            查看通道
          </Button>
          <Button onClick={() => refresh(record.deviceId)}>
            刷新设备
          </Button>
          <Button onClick={() => openModal(text, record)} danger>
            删除设备
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    throw error;
  }
  const deviceList = Object.values(data?.data.data).map((item: unknown) =>
    JSON.parse(typeof item === "string" ? item : JSON.stringify(item))
  );
  console.log(deviceList);
  const deviceTable: DeviceDataType[] = deviceList.map((item, index) => ({
    index,
    key: item.deviceId,
    deviceId: item.deviceId,
    channelCount: +item.channelCount,
    deviceName: item.deviceName,
    lastPulse: new Date(item.lastPulse).toLocaleString(),
    onlineStatus:
      (item.lastRegisterTime + item.registerExpires > Date.now() || item.lastPulse + item.registerExpires > Date.now())
        ? "在线"
        : "离线",
  }));

  return (
    <div>
      {contextHolder}
      <Modal
        title="确认删除?"
        open={modalOpen}
        onOk={() => handleDelete(deleteChoice)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      ></Modal>
      <div className=" font-bold text-lg mb-4">设备列表</div>
      <Table columns={columns} dataSource={deviceTable} pagination={false} />
      <Outlet />
    </div>
  );
}

export default DeviceList;

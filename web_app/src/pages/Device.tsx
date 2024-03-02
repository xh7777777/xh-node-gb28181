import React from 'react'
import { useRequest } from 'ahooks'
import { getDeviceList, testInvite, closeInvite } from '../apis'
import { Spin } from 'antd'
import { Button, Table, TableProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';
import { DeviceDataType } from '../data/tableData'

function Device() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, error, loading } = useRequest(async () => await getDeviceList());

  async function inviteStream(deviceId: string) {
    const res = await testInvite(deviceId);
    console.log(res);
  }

  async function closeStream(deviceId: string, channelId: string) {
    const res = await closeInvite(deviceId, channelId);
    console.log(res);
  }
  console.log(location);

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
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => (
        <Button onClick={() => navigate('/device?channel=1')}>
          查看通道
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    throw error;
  }
  const deviceList = Object.values(data?.data.data).map((item: unknown) => (JSON.parse(typeof item === 'string' ? item : JSON.stringify(item))));
  const deviceTable: DeviceDataType[] = deviceList.map((item, index) => ({
    index,
    key: item.deviceId,
    deviceId: item.deviceId,
    channelCount: +item.channelCount,
    deviceName: item.deviceName,
  }));
  console.log(deviceList);
  console.log(deviceTable);

  return (
    <div>
          <div className=' font-bold text-lg mb-4'>设备列表</div>
          <Button onClick={async () => await inviteStream(deviceList[0].deviceId)}>
            测试拉流
          </Button>
          <Button onClick={async () => await closeStream(deviceList[0].deviceId, deviceList[0].channelCount)}>
            发送bye停止推流
          </Button>
          <Table
            columns={columns}
            dataSource={deviceTable}
            pagination={false}
          />
    </div>

  )
}

export default Device
import React from 'react'
import { useRequest } from 'ahooks'
import { getDeviceList, testInvite, closeInvite } from '../apis'
import { Spin } from 'antd'
import { Button, Table, TableProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';
import { DeviceChannelDataType } from '../data/tableData'

function DeviceChannel() {
  const navigate = useNavigate();
  const location = useLocation();
  // 获取设备通道
  const { data, error, loading } = useRequest(async () => await getDeviceList());

  const columns: TableProps<DeviceChannelDataType>["columns"] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "通道名称",
      dataIndex: "channelName",
      key: "deviceName",
    },
    {
      title: "通道号",
      dataIndex: "channelId",
      key: "channelId",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => (
        <Button onClick={() => navigate('/device?channel=1')}>
          播放视频
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
  // const channelList = Object.values(data?.data.data).map((item: unknown) => (JSON.parse(typeof item === 'string' ? item : JSON.stringify(item))));
  // const deviceTable: DeviceChannelDataType[] = channelList.map((item, index) => ({
  //   index,
  //   key: item.channelId,
  //   channelId: item.channelId,
  //   channelName: item.channelName,
  // }));
  function handlePlayVideo() {
    navigate('/device/channel/video')
  }


  return (
    <div>
          <div className=' font-bold text-lg mb-4'>通道列表</div>
          <Button onClick={handlePlayVideo}>播放视频</Button>
          {/* <Table
            columns={columns}
            dataSource={deviceTable}
            pagination={false}
          /> */}
    </div>

  )
}

export default DeviceChannel
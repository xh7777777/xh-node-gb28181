import React from 'react'
import { useRequest } from 'ahooks'
import { getVideoUrl, getChannelList, closeInvite } from '../apis'
import { Spin } from 'antd'
import { Button, Table, TableProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';
import { DeviceChannelDataType } from '../data/tableData'
import VideoPopUp from '../components/VideoPopUp'

function DeviceChannel() {
  const navigate = useNavigate();
  const location = useLocation();
  const deviceId = location.search.split('=')[1]
  const [socketUrl, setSocketUrl] = React.useState<string>("");
  const [currentChannelId, setCurrentChannelId] = React.useState<string>("");
  const [videoShow, setVideoShow] = React.useState<boolean>(false);
  // 获取设备通道
  const { data, error, loading } = useRequest(async () => await getChannelList(deviceId));

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
        <Button onClick={() => handlePlayVideo(record.channelId)}>
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
  const channelList = Object.values(data?.data.data).map((item: unknown) => (JSON.parse(typeof item === 'string' ? item : JSON.stringify(item))));
  const deviceTable: DeviceChannelDataType[] = channelList.map((item, index) => ({
    index,
    key: item.channelId,
    channelId: item.channelId,
    channelName: item.channelName,
  }));

  async function handlePlayVideo(channelId: string) {
    try {
      setCurrentChannelId(channelId)
      const { data } = await getVideoUrl(deviceId, channelId);
      console.log(data.data)
      const socketUrl = data?.data?.prefix + '/' + data?.data?.url.replace(/\//g, "%2F");
      setSocketUrl(socketUrl)
      setVideoShow(true)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCloseVideo() {
    await closeInvite(deviceId, currentChannelId);
    setCurrentChannelId('');
    setVideoShow(false)
  }


  return (
    <div>
          <div className=' font-bold text-lg mb-4'>通道列表</div>
          <Table
            columns={columns}
            dataSource={deviceTable}
            pagination={false}
          />
          <VideoPopUp socketUrl={socketUrl} show={videoShow} handleCloseVideo={handleCloseVideo}/>
    </div>

  )
}

export default DeviceChannel
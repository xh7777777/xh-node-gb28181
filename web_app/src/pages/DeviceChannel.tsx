import React from 'react'
import { useRequest } from 'ahooks'
import { getVideoUrl, getChannelList, closeInvite, deleteChannelVideo } from '../apis'
import { Spin } from 'antd'
import { Button, Table, TableProps, message, Modal } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom';
import { DeviceChannelDataType } from '../data/tableData'
import VideoPopUp from '../components/VideoPopUp'

function DeviceChannel() {
  const navigate = useNavigate();
  const location = useLocation();
  const deviceId = location.search.split('=')[1]
  const [socketUrl, setSocketUrl] = React.useState<string>("");
  const [currentChannelId, setCurrentChannelId] = React.useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [videoShow, setVideoShow] = React.useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  // 获取设备通道
  const { data, error, loading } = useRequest(async () => await getChannelList(deviceId));

  const handleAddToMain = (channelId: string) => {
    setCurrentChannelId(channelId)
    setModalOpen(true)
  }

  const handleSetStorage = ({channelId, deviceId, socketUrl, section}: {channelId: string, deviceId: string, socketUrl: string, section: number}) => {
    const storage = window.localStorage;
    const streamObj = {
      section,
      channelId,
      deviceId,
      socketUrl
    }
    const streams = storage.getItem('stream')
    if (streams) {
      const streamArray = JSON.parse(streams)
      let isExist = false;
      for (let i = 0; i < streamArray.length; i++) {
        if (streamArray[i].section === section) {
          streamArray[i] = streamObj;
          isExist = true;
          break;
        }
      }
      if (!isExist) streamArray.push(streamObj)
      storage.setItem('stream', JSON.stringify(streamArray))
    } else {
      storage.setItem('stream', JSON.stringify([streamObj]))
    }
    setModalOpen(false)
    messageApi.success('添加成功')
  }

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
      title: "设备id",
      dataIndex: "deviceId",
      key: "deviceId",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => (
        <div className='flex gap-2'>
          <Button onClick={() => handlePlayVideo(record.channelId, record.deviceId)}>
            播放视频
          </Button>
          <Button onClick={() => handleAddToMain(record.channelId)}>
          添加首页
        </Button>
          <Button onClick={() => handleCloseVideo(record.channelId, record.deviceId)} danger>
          关闭视频
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
    )
  }

  if (error) {
    throw error;
  }
  const channelList = Object.values(data?.data.data).map((item: unknown) => (JSON.parse(typeof item === 'string' ? item : JSON.stringify(item))));
  const deviceTable: DeviceChannelDataType[] = channelList.map((item, index) => ({
    index,
    deviceId: item.deviceId,
    key: item.channelId,
    channelId: item.channelId,
    channelName: item.channelName,
  }));

  async function handlePlayVideo(channelId: string, deviceId: string) {
    try {
      setCurrentChannelId(channelId)
      const { data } = await getVideoUrl(deviceId, channelId);
      const socketUrl = data?.data?.prefix + '/' + data?.data?.url.replace(/\//g, "%2F");
      setSocketUrl(socketUrl)
      setVideoShow(true)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleCloseVideo(channelId: string, deviceId: string) {
    const res = await deleteChannelVideo(deviceId, channelId);
    messageApi.success(res?.data?.data?.msg)
  }


  return (
    <div>
      {contextHolder}
          <div className=' font-bold text-lg mb-4'>通道列表</div>
          <Modal
          title="选择分区"
          open={modalOpen}
          // onOk={() => handleDelete(deleteChoice)}
          footer={null}
          onCancel={() => setModalOpen(false)}
        >
          <div className='h-80'>
            <div className=' flex-1 h-full flex gap-2 flex-col text-white font-bold text-3xl'>
            <div className='flex h-1/2 gap-2'>
            <div onClick={() => handleSetStorage({channelId: currentChannelId, deviceId, socketUrl, section: 1})} className=' w-1/2 bg-black flex justify-center items-center cursor-pointer hover:bg-cyan-800 duration-150 transition-colors'>1</div>
            <div onClick={() => handleSetStorage({channelId: currentChannelId, deviceId, socketUrl, section: 2})} className=' w-1/2 bg-black flex justify-center items-center cursor-pointer hover:bg-cyan-800 duration-150 transition-colors'>2</div>
            </div>
            <div className='flex h-1/2 gap-2'>
            <div onClick={() => handleSetStorage({channelId: currentChannelId, deviceId, socketUrl, section: 3})} className=' w-1/2 bg-black flex justify-center items-center cursor-pointer hover:bg-cyan-800 duration-150 transition-colors'>3</div>
            <div onClick={() => handleSetStorage({channelId: currentChannelId, deviceId, socketUrl, section: 4})} className=' w-1/2 bg-black flex justify-center items-center cursor-pointer hover:bg-cyan-800 duration-150 transition-colors'>4</div>
            </div>
          </div>
          </div>
        </Modal>
          <Table
            columns={columns}
            dataSource={deviceTable}
            pagination={false}
          />
          <VideoPopUp socketUrl={socketUrl} show={videoShow} handleCloseVideo={() => setVideoShow(false)} deviceId={deviceId} channelId={currentChannelId}/>
    </div>

  )
}

export default DeviceChannel
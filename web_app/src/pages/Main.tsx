import React from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket'
import { Button, message, Tree } from 'antd'
import MsePlayer from '../components/MsePlayer'
import { getVideoUrl } from '../apis'

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

function Main() {
    const [streams, setStreams] = React.useState<any>([])
    const [treeData, setTreeData] = React.useState<DataNode[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [socketUrl1, setSocketUrl1] = React.useState<string>("");
    const [socketUrl2, setSocketUrl2] = React.useState<string>("");
    const [socketUrl3, setSocketUrl3] = React.useState<string>("");
    const [socketUrl4, setSocketUrl4] = React.useState<string>("");

    React.useEffect(() => {
      let streams = window.localStorage.getItem('stream')
      if (streams) {
        setStreams(JSON.parse(streams).sort((a: any, b: any) => a.section - b.section))
        let temp = JSON.parse(streams).reduce((acc: any, cur: any) => {
          if (cur.deviceId in acc && Array.isArray(acc[cur.deviceId])) {
            acc[cur.deviceId].push({title: `${cur.channelName}@${cur.channelId}`, key: cur.channelId + Math.random()})
          } else {
            acc[cur.deviceId] = [{title:`${cur.channelName}@${cur.channelId}`, key: cur.channelId + Math.random()}]
          }
          return acc
        }, {})
        let st: DataNode = {
          title: 'XH-GB28181平台',
          key: 'XH-GB28181平台',
          children: []
        };
        for (let key in temp) {
          st?.children?.push({
            title: key,
            key: key,
            children: temp[key]
          });
        }
        setTreeData([st])
      }
    }, [])

    async function handlePlayVideo() {
      if (streams.length === 0) {
        messageApi.error('请添加通道')
        return
      }
      try {
        for (let i = 0; i < streams.length; i++) {
          const { data } = await getVideoUrl(streams[i].deviceId, streams[i].channelId);
          const socketUrl = data?.data?.prefix + '/' + data?.data?.url.replace(/\//g, "%2F");
          if (streams[i].section === 1) setSocketUrl1(socketUrl)
          if (streams[i].section === 2) setSocketUrl2(socketUrl)
          if (streams[i].section === 3) setSocketUrl3(socketUrl)
          if (streams[i].section === 4) setSocketUrl4(socketUrl)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const handleCloseVideo = () => {
      setSocketUrl1('')
      setSocketUrl2('')
      setSocketUrl3('')
      setSocketUrl4('')
      messageApi.success('关闭视频')
    }
    const handleDeleteChannel = (channelId: string, section: number) => {
      const storage = window.localStorage;
      const streams = storage.getItem('stream')
      if (streams) {
        const streamArray = JSON.parse(streams)
        const newStreamArray = streamArray.filter((stream: any) => stream.channelId !== channelId || stream.section !== section)
        storage.setItem('stream', JSON.stringify(newStreamArray))
        setStreams(newStreamArray)
      }
    }

  return (
    <div className='flex h-full gap-6 items-center'>
        {contextHolder}
        <div className=' w-1/6 bg-slate-500 h-full flex flex-col rounded-lg overflow-hidden'>
            <div className=' h-20 w-full text-white font-bold text-3xl p-4 flex justify-center items-center bg-slate-300 border-b-2'>
                通道列表
            </div>
            <Tree treeData={treeData} defaultExpandAll={true}/>
            {streams.map((stream: any) => (
              <div className=' h-20 w-full text-white font-bold text-md p-4 flex justify-center items-center bg-slate-300 border-b-2' key={stream.section}>{stream.section}:{stream.channelId}
                <Button onClick = {() => handleDeleteChannel(stream.channelId, stream.section)} danger>删除通道</Button>
              </div>
            ))}
            <div className=' flex mt-4 justify-between gap-3'>
              <Button className='flex-1 bg-blue-300' onClick = {() => handlePlayVideo()}>预览视频</Button>
              <Button className='flex-1 bg-blue-300' onClick = {() => handleCloseVideo()}>关闭视频</Button>
            </div>
        </div>
        <div className=' flex-1 h-full flex gap-2 flex-col text-white font-bold text-3xl'>
          <div className='flex h-1/2 gap-2'>
          <div className=' w-1/2 bg-black flex justify-center items-center'>{socketUrl1.length === 0 ? 1 : <MsePlayer socketUrl={socketUrl1}/>}</div>
          <div className=' w-1/2 bg-black flex justify-center items-center'>{socketUrl2.length === 0 ? 2 : <MsePlayer socketUrl={socketUrl2}/>}</div>
          </div>
          <div className='flex h-1/2 gap-2'>
          <div className=' w-1/2 bg-black flex justify-center items-center'>{socketUrl3.length === 0 ? 3 : <MsePlayer socketUrl={socketUrl3}/>}</div>
          <div className=' w-1/2 bg-black flex justify-center items-center'>{socketUrl4.length === 0 ? 4 : <MsePlayer socketUrl={socketUrl4}/>}</div>
          </div>
        </div>
    </div>
  )
}

export default Main
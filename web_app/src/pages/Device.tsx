import React from 'react'
import { useRequest } from 'ahooks'
import { getDeviceList, testInvite, closeInvite } from '../apis'
import { Spin } from 'antd'
import { Button } from 'antd'

function Device() {
  const { data, error, loading } = useRequest(async () => await getDeviceList());

  async function inviteStream(deviceId: string) {
    const res = await testInvite(deviceId);
    console.log(res);
  }

  async function closeStream(deviceId: string, channelId: string) {
    const res = await closeInvite(deviceId, channelId);
    console.log(res);
  }

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
  const deviceList = JSON.parse(Object.values(data?.data.data)[0] as string);
  console.log(deviceList);

  return (
    <div>
          <div className=' font-bold text-lg mb-4'>设备列表</div>
          <Button onClick={async () => await inviteStream(deviceList.deviceId)}>
            测试拉流
          </Button>
          <Button onClick={async () => await closeStream(deviceList.deviceId, deviceList.channelCount)}>
            发送bye停止推流
          </Button>
    </div>

  )
}

export default Device
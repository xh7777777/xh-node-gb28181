import React from 'react'
import { useRequest } from 'ahooks'
import { getDeviceList } from '../apis'
import { Spin } from 'antd'

function Device() {
  const { data, error, loading } = useRequest(async () => await getDeviceList());

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

  console.log(JSON.parse(Object.values(data?.data.data)[0] as string));

  return (
    <div>
          <div className=' font-bold text-lg mb-4'>设备列表</div>
    </div>

  )
}

export default Device
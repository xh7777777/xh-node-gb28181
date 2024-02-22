import React from 'react'
import {useRequest} from 'ahooks'
import { getPlatformConfig } from '../apis'
import { Spin, Descriptions, DescriptionsProps } from 'antd';

const configMap = {
  port: 'SIP端口',
  host: 'SIP服务器地址',
  id: 'SIPID',
  version: 'SIP版本',
  realm: 'SIP域',
  password: 'SIP密码',
  protocol: '传输协议',
  userAgent: '用户代理',
  maxForwards: '最大转发次数',
}

function Config() {
  const { data, error, loading } = useRequest(async () => await getPlatformConfig());

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

  // @ts-ignore
  const configDescription: DescriptionsProps['items'] = Object.entries(data?.data?.data).reduce((acc, [key, value]) => {
    if (!acc) {
      return [];
    }
    acc.push({
      key: key,
      // @ts-ignore
      label: configMap[`${key}`]+":",
      children: value as string
    });
    return acc; // Add this line to return the updated accumulator
  }, [] as DescriptionsProps['items']);

  return (
    <div>
      <div className=' font-bold text-lg mb-4'>平台信息</div>
      <Descriptions bordered items={configDescription} column={{
        xs: 1,
        sm: 2,
      }} labelStyle={{backgroundColor: '#818cf8', color: '#fff', fontWeight: 'bold'}} contentStyle={{
        backgroundColor: '#ddd6fe',
        color: '#fff',
        fontWeight: 'bold'
      }}/>
    </div>
  )
}

export default Config
import { TableProps } from 'antd'

export interface UserDataType {
    key: string;
    no: number;
    username: string;
    userType: string;
  }

export  interface DeviceDataType {
    index: number;
    key: string;
    deviceId: string;
    channelCount: number;
    deviceName: string;
  }

export interface DeviceChannelDataType {
    index: number;
    key: string;
    channelId: string;
    channelName: string;
}
  
import MessageGenerator from "../generator/MessageGenerator";
import { DeviceInfoCmdTypeEnum, deviceControlActionEnum, ptzCmdEnum } from "../../types/enum";
import { IRedisDevice } from "../../models/redis/device";
import sip from "sip";

export default class MessageEmitter {
    public static async sendKeepAlive(device: IRedisDevice) {
        const message = MessageGenerator.getDeviceInfo(device, DeviceInfoCmdTypeEnum.Keepalive);
        sip.send(message);
    };

    public static async sendGetDeviceCatalog(device: IRedisDevice) {
        const message = MessageGenerator.getDeviceInfo(device, DeviceInfoCmdTypeEnum.Catalog);
        sip.send(message);
    }

    public static async sendGetDeviceInfo(device: IRedisDevice) {
        const message = MessageGenerator.getDeviceInfo(device, DeviceInfoCmdTypeEnum.DeviceInfo);
        sip.send(message);
    }

    public static async sendGetDeviceStatus(device: IRedisDevice) {
        const message = MessageGenerator.getDeviceInfo(device, DeviceInfoCmdTypeEnum.DeviceStatus);
        sip.send(message);
    }

    // 云台控制
    public static async sendPtz(device: IRedisDevice, action: deviceControlActionEnum) {
        const message = MessageGenerator.ptzControl(device, DeviceInfoCmdTypeEnum.DeviceControl, ptzCmdEnum[action as keyof typeof ptzCmdEnum]);
        sip.send(message);
    }

    // 获取录像信息
    public static async sendRecordInfo(device: IRedisDevice, channelId: string, startTime: string, endTime: string) {
        const message = MessageGenerator.getRecordInfo(device, DeviceInfoCmdTypeEnum.RecordInfo, channelId, startTime, endTime);
        sip.send(message);

    }
}
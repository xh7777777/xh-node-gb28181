import MessageGenerator from "../generator/MessageGenerator";
import { DeviceInfoCmdTypeEnum } from "../../types/enum";
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
}
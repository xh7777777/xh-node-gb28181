import sip from "sip";
import { SipRequest } from "../../types/sip.type";
import { parseString } from "xml2js";
import { DeviceController } from "../../controller/DeviceController";
import { getDeviceInfoFromSip } from "../../utils/SipUtil";
import digest from "sip/digest";
import logUtil from "../../utils/logUtil";
const logger = logUtil("MessageHandler");
import { DeviceInfoCmdTypeEnum, zlmStreamMode } from "../../types/enum";
import xml2js from "xml2js";
import MessageEmitter from "../emitter/MessageEmitter";
import { IDeviceChannel } from "../../models/redis/device";

interface XmlContent {
  Notify: {
    CmdType: string[];
    SN: string[];
    DeviceID: string[];
    Status: string[];
    Info: string[];
  };
}

export default class MessageHandler {
  public static async handleMessage(req: SipRequest) {
    // 解析xml
    parseString(req.content || "", async (err, result: XmlContent) => {
      // @ts-ignore
      const { CmdType } = result.Notify || result.Response;
      if (!CmdType) {
        sip.send(sip.makeResponse(req, 400, "Bad Request"));
      }
      if (CmdType[0] === DeviceInfoCmdTypeEnum.Keepalive) {
        logger.info("处理心跳");
        await MessageHandler.keepAlive(req);
      }
      if (CmdType[0] === DeviceInfoCmdTypeEnum.Catalog) {
        // @ts-ignore
        logger.info("设备目录信息", result.Response);
        // todo 
        // 更新设备通道信息
        // @ts-ignore
        const { DeviceList, DeviceID } = result.Response;
        const deviceId = DeviceID ? DeviceID[0] : "";
        const deviceChannel = await DeviceController.getChannelListFromRedis(deviceId);
        if (!deviceChannel.length) {
          // 没有通道信息， 初始化通道信息
          for (let i = 0; i < DeviceList.length; i++) {
            const { DeviceID, Name } = DeviceList[i].Item[0];
            const channel: IDeviceChannel = {
              deviceId: deviceId,
              channelName: Name ? Name[0] : "",
              channelId: DeviceID ? DeviceID[0] : "",
              streamMode: zlmStreamMode.tcpPassive
            };
            await DeviceController.setChannelToRedis(channel);
          }
        }
      
        sip.send(sip.makeResponse(req, 200, "Ok"));
      }
      if (CmdType[0] === DeviceInfoCmdTypeEnum.DeviceInfo) {
        // @ts-ignore
        await MessageHandler.updateDeviceInfo(req, result.Response);
        // @ts-ignore
        // todo 
        sip.send(sip.makeResponse(req, 200, "Ok"));
      }
      if (CmdType[0] === DeviceInfoCmdTypeEnum.DeviceStatus) {
         // @ts-ignore
         logger.info("设备状态信息", result.Response);
        // todo 
        sip.send(sip.makeResponse(req, 200, "Ok"));
      }
    });
  }

  // 心跳处理
  private static async keepAlive(req: SipRequest) {
    const newDevice = getDeviceInfoFromSip(req);
    const device = await DeviceController.getDeviceById(
      newDevice
    );
    // 检测设备是否存在
    if (device === null) {
      const resp = digest.challenge(
        { realm: process.env.SIP_REALM || "" },
        sip.makeResponse(req, 401, "Unauthorized")
      );
      sip.send(resp);
      return;
    } 
    // 更新设备信息
    device.lastPulse = new Date().getTime();
    await DeviceController.setDeviceToRedis(device);
    const resp = sip.makeResponse(req, 200, "Ok");
    sip.send(resp);
  }

  private static async updateDeviceInfo(req: SipRequest, content:any) {
    const device = getDeviceInfoFromSip(req);
    const { DeviceName = [], ManuFacturer = [], Model = [], Channel = []} = content;
    device.deviceName = DeviceName[0];
    device.manufacturer = ManuFacturer[0];
    device.model = Model[0];
    device.channelCount = Channel[0];
    await DeviceController.setDeviceToRedis(device);
    sip.send(sip.makeResponse(req, 200, "Ok"));
  }
}

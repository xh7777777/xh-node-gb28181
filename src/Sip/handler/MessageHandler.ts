import sip from "sip";
import { SipRequest } from "../../types/sip.type";
import { parseString } from "xml2js";
import { DeviceController } from "../../controller/DeviceController";
import { getDeviceInfoFromSip } from "../../utils/SipUtil";
import digest from "sip/digest";
import logUtil from "../../utils/logUtil";
const logger = logUtil("MessageHandler");
import { DeviceInfoCmdTypeEnum } from "../../types/enum";
import xml2js from "xml2js";

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
    parseString(req.content, async (err, result: XmlContent) => {
      // 有时候返回的报文没有Notify字段而是Response字段
      // @ts-ignore
      const { CmdType } = result.Notify || result.Response;
      if (!CmdType) {
        logger.error("报文格式错误", result);
        sip.send(sip.makeResponse(req, 400, "Bad Request"));
      }
      if (CmdType[0] === DeviceInfoCmdTypeEnum.Keepalive) {
        logger.info("处理心跳");
        await MessageHandler.keepAlive(req);
      }
      if (CmdType[0] === DeviceInfoCmdTypeEnum.Catalog) {
        // @ts-ignore
        logger.info("设备目录信息", result.Response.DeviceList);
        // todo 200响应
        // .$.Num, .Item
        await MessageHandler.updateDeviceInfo(req);
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
    } else {
      // 更新心跳时间及设备信息
      newDevice.lastPulse = Date.now();
      await DeviceController.setDeviceToRedis(newDevice);
    }
    const resp = sip.makeResponse(req, 200, "Ok");
    sip.send(resp);
  }

  private static async updateDeviceInfo(req: SipRequest) {
    // const device = getDeviceInfoFromSip(req);
    // await DeviceController.setDeviceToRedis(device);
    sip.send(sip.makeResponse(req, 200, "Ok"));
  }


}

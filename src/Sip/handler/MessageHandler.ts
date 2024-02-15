import sip from "sip";
import { SipRequest } from "../../types/sip.type";
import { parseString } from "xml2js";
import { DeviceController } from "../../controller/DeviceController";
import { getDeviceInfoFromSip } from "../../utils/SipUtil";
import digest from "sip/digest";
import logUtil from "../../utils/logUtil";
const logger = logUtil("MessageHandler");

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
      const { CmdType } = result.Notify;
      if (CmdType[0] === "Keepalive") {
        await MessageHandler.keepAlive(req);
      }
    });
  }

  // 心跳处理
  private static async keepAlive(req: SipRequest) {
    const device = await DeviceController.getDeviceById(
      getDeviceInfoFromSip(req)
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
      // 更新心跳时间
      device.lastPulse = Date.now();
      logger.debug(`设备心跳更新,device:${JSON.stringify(device)} ， ${Date.now()}`);
      await DeviceController.setDeviceToRedis(device);
    }
    const resp = sip.makeResponse(req, 200, "Ok");
    sip.send(resp);
  }

}

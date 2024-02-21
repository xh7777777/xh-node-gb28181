import sip from "sip";
import { SipRequest } from "../../types/sip.type";
import { IRedisDevice } from "../../models/redis/device";
import { v4 } from "uuid";
import { Builder } from "xml2js";
import { SipMessageHelper, ISipMessage } from "../../utils/SipUtil";
import { DeviceInfoCmdTypeEnum, sipMethodEnum, sipContentTypeEnum } from "../../types/enum";

// 负责发送message
export default class MessageGenerator {
  public static xmlBuilder = new Builder({
    xmldec: {
      version: "1.0",
      encoding: "GB2312",
      standalone: true
    }
  })

  public static getDeviceInfo(device: IRedisDevice, CmdType: DeviceInfoCmdTypeEnum): SipRequest {
    const [deviceId, deviceRealm] = device.deviceId.split("@");
    const queryObj = {
      Query: {
        CmdType,
        SN: v4(),
        DeviceID: deviceId,
      },
    };

    const xml = MessageGenerator.xmlBuilder.buildObject(queryObj);

    const sipMessage: ISipMessage = {
      method: sipMethodEnum.message,
      content: xml + '\r\n\r\n',
      contentType: sipContentTypeEnum.xml,
      deviceInfo: device,
    };
    const sipMessageHelper = new SipMessageHelper(sipMessage);
    // logger.info("生成获取设备信息报文：", sipMessageHelper.getMessage());
    return sipMessageHelper.getMessage();
  }
}

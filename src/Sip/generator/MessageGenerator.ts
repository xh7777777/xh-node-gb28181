import sip from "sip";
import { SipRequest } from "../../types/sip.type";
import { IRedisDevice } from "../../models/redis/device";
import { v4 } from "uuid";
import { SipMessageHelper, ISipMessage } from "../../utils/SipUtil";
import { DeviceInfoCmdTypeEnum, sipMethodEnum, sipContentTypeEnum } from "../../types/enum";
import { xmlBuilder } from "../../utils/xmlUtil";

// 负责发送message
export default class MessageGenerator {

  // 获取设备信息
  public static getDeviceInfo(device: IRedisDevice, CmdType: DeviceInfoCmdTypeEnum): SipRequest {
    const { deviceId } = device;
    const queryObj = {
      Query: {
        CmdType,
        SN: v4(),
        DeviceID: deviceId,
      },
    };

    const xml = xmlBuilder.buildObject(queryObj);

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

  // 云台控制Message
  public static ptzControl(device: IRedisDevice, CmdType: DeviceInfoCmdTypeEnum, ptzCmd: string): SipRequest {
    const { deviceId } = device;
    const queryObj = {
      Query: {
        CmdType,
        SN: v4(),
        DeviceID: deviceId,
        PTZCmd: ptzCmd,
      },
    };

    const xml = xmlBuilder.buildObject(queryObj);

    const sipMessage: ISipMessage = {
      method: sipMethodEnum.message,
      content: xml + '\r\n\r\n',
      contentType: sipContentTypeEnum.xml,
      deviceInfo: device,
    };
    const sipMessageHelper = new SipMessageHelper(sipMessage);
    // logger.info("生成云台控制报文：", sipMessageHelper.getMessage());
    return sipMessageHelper.getMessage();
  }
}

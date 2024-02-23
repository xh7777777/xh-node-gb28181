import { SipMessageHelper, ISipMessage } from "../../utils/SipUtil";
import { DeviceInfoCmdTypeEnum, sipMethodEnum, sipContentTypeEnum } from "../../types/enum";
import { xmlBuilder } from "../../utils/xmlUtil";
import { IRedisDevice } from '../../models/redis/device';
import { SipRequest } from "../../types/sip.type";

export default class InviteGenerator {
    public static invitePushStream(device: IRedisDevice, sdp: string): SipRequest  {
        // const sdpObj = {
        //     channel: 
        // }
        const sipMessage: ISipMessage = {
            method: sipMethodEnum.invite,
            content:  '\r\n\r\n',
            contentType: sipContentTypeEnum.xml,
            deviceInfo: device,
          };

        const sipMessageHelper = new SipMessageHelper(sipMessage);
        // logger.info("生成获取设备信息报文：", sipMessageHelper.getMessage());
        return sipMessageHelper.getMessage();
    }
}
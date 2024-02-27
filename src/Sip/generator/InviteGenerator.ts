import { SipMessageHelper, ISipMessage, ISdpItem } from "../../utils/SipUtil";
import { DeviceInfoCmdTypeEnum, sipMethodEnum, sipContentTypeEnum } from "../../types/enum";
import { xmlBuilder } from "../../utils/xmlUtil";
import { IRedisDevice } from '../../models/redis/device';
import { SipRequest } from "../../types/sip.type";

export default class InviteGenerator {
    public static invitePushStream(device: IRedisDevice, sdp?: ISdpItem): SipRequest  {
        const sdpContent = SipMessageHelper.generateSdpContent({
            udpPort: 8554,
            channel: device.deviceId,
            mediaIp: device.sipHost || "",
            ssrc: '0100000001',
        });
        const sipMessage: ISipMessage = {
            method: sipMethodEnum.invite,
            content:  sdpContent,
            contentType: sipContentTypeEnum.sdp,
            deviceInfo: device,
          };

        const sipMessageHelper = new SipMessageHelper(sipMessage);
        // logger.info("生成获取设备信息报文：", sipMessageHelper.getMessage());
        return sipMessageHelper.getMessage();
    }
}
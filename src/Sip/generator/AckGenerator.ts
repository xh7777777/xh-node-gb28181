import { SipRequest, SipResponse } from "../../types/sip.type";
import { SipMessageHelper, ISipMessage, getDeviceInfoFromSip } from "../../utils/SipUtil";
import { sipMethodEnum, sipContentTypeEnum } from "../../types/enum";
import { IRedisDevice } from "../../models/redis/device";
export default class AckGenerator {
    public static ackInviteSdp(req: SipRequest, sdp:string, device:IRedisDevice): SipRequest {
        const sipMessage: ISipMessage = {
            method: sipMethodEnum.ack,
            content: sdp,
            contentType: sipContentTypeEnum.sdp,
            deviceInfo: device,
        };

        const sipMessageHelper = new SipMessageHelper(sipMessage);
        return sipMessageHelper.getMessage();
    }

    public static generateCommonAck(req: SipRequest, device: IRedisDevice): SipRequest {
        const sipMessage: ISipMessage = {
            method: sipMethodEnum.ack,
            content: '',
            deviceInfo: device,
        };

        const sipMessageHelper = new SipMessageHelper(sipMessage);
        return sipMessageHelper.getMessage();
    }
}
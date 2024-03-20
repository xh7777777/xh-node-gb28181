import { SipRequest } from "../../types/sip.type";
import { SipMessageHelper, ISipMessage } from "../../utils/SipUtil";
import { sipMethodEnum, sipContentTypeEnum } from "../../types/enum";
import { getDeviceInfoFromSip } from "../../utils/SipUtil";
import logUtil from "../../utils/logUtil";
const logger = logUtil("InviteHandler");
import sip from "sip";
export default class InviteHandler {
    public static async handleInvite(req: SipRequest) {
        // handle invite
    }

    public static async responseInviteAck(req: SipRequest) {
        const device = await getDeviceInfoFromSip(req);
        const message = new SipMessageHelper({
            method: sipMethodEnum.ack,
            content: '',
            contentType: sipContentTypeEnum.xml,
            deviceInfo: device,
        }).getMessage();

        logger.info("回复invite ack报文：", message);
        sip.send(message);
    }
}
import { DeviceController } from "../../controller/DeviceController";
import { SipMessageHelper, ISipMessage } from "../../utils/SipUtil";
import { IDeviceSessionCache } from "../../models/redis/device";
import { sipMethodEnum } from "../../types/enum";
import logUtil from "../../utils/logUtil";
const logger = logUtil("ByeGenerator");

export default class ByeGenerator {
    public static async generateDeviceSessionBye(session: IDeviceSessionCache) {
        const deviceId = session.deviceId.split("@")[0];
        const device = await DeviceController.getDeviceById({deviceId});
    
        // 报文需要保证call-id to from cseq等字段一致
        const messageObj: ISipMessage = {
            method: sipMethodEnum.bye,
            deviceInfo: device,
            cesqNumber: session.cseqNum,
            callId: session.callId,
            toTag: session.toTag,
            fromTag: session.fromTag,
        }
        const sipMessageHelper = new SipMessageHelper(messageObj);

        logger.info("生成bye报文：", sipMessageHelper.getMessage());
        return sipMessageHelper.getMessage();
    }
}
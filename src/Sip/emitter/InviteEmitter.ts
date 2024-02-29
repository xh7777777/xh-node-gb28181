import sip from 'sip';
import { IRedisDevice } from '../../models/redis/device';
import InviteGenerator from '../generator/InviteGenerator';
import logUtil from '../../utils/logUtil';
const logger = logUtil("InviteEmitter");
import AckGenerator from '../generator/AckGenerator';
import { SipMessageHelper } from '../../utils/SipUtil';
import { SIP_CONFIG } from '../../config';

export default class InviteEmitter {
    public static async sendInviteStream(device: IRedisDevice) {
        const sdpContent = SipMessageHelper.generateSdpContent({
            udpPort: 10000,
            channel: device.deviceId,
            clientIp: SIP_CONFIG.host || "",
            ssrc: "0100000001"
        });
        const message = InviteGenerator.invitePushStream(device, sdpContent);

        sip.send(message, function(res) {
            logger.info("invite push stream响应：", res);
            // const ackMessage = AckGenerator.ackInviteSdp(res, sdpContent, device);
            const ackMessage = AckGenerator.generateCommonAck(res, device);
            ackMessage.headers['call-id'] = res.headers['call-id'];
            ackMessage.headers.to = res.headers.to;
            ackMessage.headers.from = res.headers.from;
            logger.info("回复invite ack报文：", ackMessage);
            sip.send(ackMessage);
        });
    };
}
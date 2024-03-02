import sip from 'sip';
import { IRedisDevice, IDeviceSessionCache } from '../../models/redis/device';
import InviteGenerator from '../generator/InviteGenerator';
import logUtil from '../../utils/logUtil';
const logger = logUtil("InviteEmitter");
import AckGenerator from '../generator/AckGenerator';
import { SipMessageHelper } from '../../utils/SipUtil';
import { SIP_CONFIG } from '../../config';
import { SipRequest } from '../../types/sip.type';
import { DeviceController } from '../../controller/DeviceController';

export default class InviteEmitter {
    public static async sendInviteStream(device: IRedisDevice) {
        const sdpContent = SipMessageHelper.generateSdpContent({
            udpPort: 10000,
            channel: device.deviceId,
            clientIp: SIP_CONFIG.host || "",
            ssrc: "0100000001"
        });
        const message = InviteGenerator.invitePushStream(device, sdpContent);

        sip.send(message, function(res:SipRequest) {
            // const ackMessage = AckGenerator.ackInviteSdp(res, sdpContent, device);
            logger.info("invite response: ", res);
            const ackMessage = AckGenerator.generateCommonAck(res, device);
            ackMessage.headers['call-id'] = res.headers['call-id'];
            ackMessage.headers.to = res.headers.to;
            ackMessage.headers.from = res.headers.from;

            // 缓存会话记录
            const session: IDeviceSessionCache = {
                deviceId: device.deviceId,
                channelId: +(device.channelCount || 1),
                callId: res.headers['call-id'],
                cseqNum: res.headers.cseq.seq + 1 || 20,
                toTag: res.headers.to.params?.tag || "",
                fromTag: res.headers.from.params?.tag || "",
            }
            DeviceController.setSessionToRedis(session);

            sip.send(ackMessage);
        });
    };
}
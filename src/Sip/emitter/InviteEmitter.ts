import sip from 'sip';
import { IRedisDevice, IDeviceSessionCache } from '../../models/redis/device';
import InviteGenerator from '../generator/InviteGenerator';
import logUtil from '../../utils/logUtil';
const logger = logUtil("InviteEmitter");
import AckGenerator from '../generator/AckGenerator';
import { SipMessageHelper, SdpHelper } from '../../utils/SipUtil';
import { SIP_CONFIG } from '../../config';
import { SipRequest } from '../../types/sip.type';
import { DeviceController } from '../../controller/DeviceController';
import ZLMediaKit from '../../Media/ZLMediaKit';
import { ZLMediaKitConfig } from '../../config';
import { HttpException } from '../../utils/httpUtil';

export default class InviteEmitter {
    /*
    * @description: 发送邀请推流
    * @param {IRedisDevice} device
    * @return boolean 是否成功
    */
    public static async sendInviteStream(device: IRedisDevice) {
        // 获取可用rtp端口
        let udpPort = 10000;
        const rtpPort = await ZLMediaKit.listRtpServer();
        if (rtpPort.code !== 0) throw new HttpException();
        if (!rtpPort.data) {
            udpPort = +ZLMediaKitConfig.rtp_port_min;
        } else {
            // 寻找可用端口
            let portList = new Map();
            rtpPort.data.forEach((item: any) => {
                portList.set(item.port, true);
            });
            for (let i = +ZLMediaKitConfig.rtp_port_min; i < +ZLMediaKitConfig.rtp_port_max; i++) {
                if (!portList.has(i)) {
                    udpPort = i;
                    break;
                }
            }
            if (udpPort === 10000) throw new HttpException("RTP端口已用完", 500);
        }

        // 创建rtp端口
        const openRtp = await ZLMediaKit.openRtpServer({
            port: udpPort,
            stream_id: device.deviceId
        });
        logger.info("创建rtp端口：", openRtp)
        if (openRtp.code !== 0) throw new HttpException("创建RTP端口失败", 500);

        logger.info("创建rtp端口成功：", openRtp);

        const sdpContent = SipMessageHelper.generateSdpContent({
            udpPort: 10000,
            channel: device.deviceId,
            clientIp: SIP_CONFIG.host || "",
            ssrc: SdpHelper.generateSsrc({history:false, realm: device.deviceRealm || ''}),
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
                rtpPort: udpPort,
                rtspUrl: `rtsp://${ZLMediaKitConfig.host}:${udpPort}/rtp/${device.deviceId}`
            }
            DeviceController.setSessionToRedis(session);

            sip.send(ackMessage);
        });
    };
}
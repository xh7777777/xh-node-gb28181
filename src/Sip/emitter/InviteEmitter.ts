import sip from 'sip';
import { IRedisDevice } from '../../models/redis/device';
import InviteGenerator from '../generator/InviteGenerator';
import logUtil from '../../utils/logUtil';
const logger = logUtil("InviteEmitter");
export default class InviteEmitter {
    public static async sendInviteStream(device: IRedisDevice) {
        const message = InviteGenerator.invitePushStream(device);
        logger.info("发送invite push stream报文：", message.headers.via);
        sip.send(message, function(res) {
            logger.info("invite push stream响应：", res);
            logger.info("invite push stream响应：");
            sip.send(sip.makeResponse(res, 200, "OK"));
        });
    };
}
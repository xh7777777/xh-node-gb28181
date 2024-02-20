import { SipRequest } from "../../types/sip.type";
import digest from "sip/digest";
import sip from "sip";
import logUtil from "../../utils/logUtil";
const logger = logUtil("RegisterHandler");
import { trimQuotString, getDeviceInfoFromSip } from "../../utils/SipUtil";
import { DeviceController } from "../../controller/DeviceController";
import { isExpire } from "../../utils/authUtil";
import { SIP_CONFIG } from "../../config";

export default class RegisterHandler {
  public static async handleRegister(req: SipRequest) {
    const resp = await this.makeRegisterResp(req);
    if (resp) {
      sip.send(resp);
    } else {
      sip.send(sip.makeResponse(req, 500, "Server Internal Error"));
    }
  }
  private static async makeRegisterResp(req: SipRequest): Promise<SipRequest> {
    const password = SIP_CONFIG.password;
    const realm = SIP_CONFIG.realm;
    let resp;
    let expire = await this.checkRegisterExpire(req);
    if (!expire) {
      logger.info(`设备已经注册且未过期,uri:${req.headers.from.uri}`);
      return sip.makeResponse(req, 200, "Ok");
    }

    // 存在验证
    if (req.headers.authorization) {
      if (
        Array.isArray(req.headers.authorization) &&
        req.headers.authorization[0]
      ) {
        // 去除多余的双引号
        req.headers.authorization[0].username = trimQuotString(
          req.headers.authorization[0].username
        );
        req.headers.authorization[0].realm = trimQuotString(
          req.headers.authorization[0].realm
        );
        req.headers.authorization[0].nonce = trimQuotString(
          req.headers.authorization[0].nonce
        );
        req.headers.authorization[0].uri = trimQuotString(
          req.headers.authorization[0].uri
        );
        req.headers.authorization[0].response = trimQuotString(
          req.headers.authorization[0].response
        );
        req.headers.authorization[0].cnonce = trimQuotString(
          req.headers.authorization[0].cnonce
        );
        const session = {
          realm,
          nonce: req.headers.authorization[0].nonce,
        };

        // 校验数字摘要
        const check = digest.authenticateRequest(session, req, {
          user: req.headers.authorization[0].username,
          password,
        });
        if (check) {
          logger.info(`成功授权,uri:${req.headers.from.uri}`);
          // 更新设备信息到redis
          await DeviceController.setDeviceToRedis(getDeviceInfoFromSip(req));
          resp = sip.makeResponse(req, 200, "Ok");
        }
      }
    } else {
      // 该方法会添加WWW-Authenticate头部， 返回401
      logger.info(`401需要授权,uri: ${req.headers.from.uri}`);
      resp = digest.challenge(
        {
          realm,
        },
        sip.makeResponse(req, 401, "Unauthorized")
      );
    }
    return resp;
  }

  private static async checkRegisterExpire(req: SipRequest): Promise<boolean> {
    const device = await DeviceController.getDeviceById(
      getDeviceInfoFromSip(req)
    );
    return isExpire(device.lastRegisterTime, device.registerExpires);
  }
}

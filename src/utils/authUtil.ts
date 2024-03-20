import logUtil from "./logUtil";
import jwt from "jsonwebtoken";
const logger = logUtil("AuthUtils");

export function isExpire(lastTime:number, expireTime:number) {
    logger.debug(`lastTime: ${lastTime}, expireTime: ${expireTime}, now: ${Date.now()}`, lastTime + expireTime < Date.now());
  return lastTime + expireTime < Date.now();
}

export function getUserTokenInfoByToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secret') as { data: string };
    return decoded.data;
  } catch (err) {
    logger.error("getUserNameByToken", err);
    return null;
  }
}
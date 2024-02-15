import logUtil from "./logUtil";
const logger = logUtil("AuthUtil");

export function isExpire(lastTime:number, expireTime:number) {
    logger.debug(`lastTime: ${lastTime}, expireTime: ${expireTime}, now: ${Date.now()}`, lastTime + expireTime < Date.now());
  return lastTime + expireTime < Date.now();
}
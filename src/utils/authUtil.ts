
export function isExpire(lastTime:number, expireTime:number) {
  return lastTime + expireTime < Date.now();
}
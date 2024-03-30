import jwt from "jsonwebtoken";

export function encodeUri(url: string) {
  // 把/ 转义成%2F
  return  url.replace(/\//g, "%2F");
}

class Resolve {
  success(msg = "success", errorCode = 1, code = 200) {
    return {
      msg,
      errorCode,
      code,
    };
  }
  fail(msg = "error", errorCode = 0, code = 404) {
    return {
      msg,
      errorCode,
      code,
    };
  }
  json(data: any, msg = "success", errorCode = 1, code = 200) {
    return {
      msg,
      errorCode,
      code,
      data,
    };
  }
}

export const resolve = new Resolve();

export class HttpException extends Error {
  errorCode;
  code;
  errorMessage;
  constructor(msg = "server error", errorCode = 10000, code = 400) {
    super();
    this.errorCode = errorCode;
    this.code = code;
    this.errorMessage = msg;
  }
}
//参数错误
export class ParameterException extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super();
    this.code = 400;
    this.errorMessage = msg || "parameter error";
    this.errorCode = errorCode || 10000;
  }
}
//认证失败
export class AuthFailed extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super();
    this.code = 401;
    this.errorMessage = msg || "授权失败";
    this.errorCode = errorCode || 10004;
  }
}
//404
export class NotFound extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super();
    this.code = 404;
    this.errorMessage = msg || "404找不到";
    this.errorCode = errorCode || 10005;
  }
}
//禁止访问
export class Forbidden extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super();
    this.code = 403;
    this.errorMessage = msg || "禁止访问";
    this.errorCode = errorCode || 10006;
  }
}
export class Existing extends HttpException {
  constructor(msg?: string, errorCode?: number) {
    super();
    this.code = 412; // 412表示xxx已存在
    this.errorMessage = msg || "已存在";
    this.errorCode = errorCode || 10006;
  }
}

//颁布令牌  generateToken生成令牌
export function generateToken(_id: string) {
  const secretKey = process.env.SECERET_KEY || 'secret';
  const expiresIn = Math.floor(Date.now()/1000) + 2 * 60 * 60;
  const accessToken = jwt.sign(
    {
      data: _id,
      exp: expiresIn,
    },
    secretKey
  );
  return accessToken ;
};

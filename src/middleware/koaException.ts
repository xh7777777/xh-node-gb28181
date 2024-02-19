import { HttpException } from "../utils/httpUtil";
import bouncer from "koa-bouncer";
import { Context, Next } from "koa";

export default async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error: any) {
    console.log(error instanceof bouncer.ValidationError);
    if (error instanceof bouncer.ValidationError) {
      ctx.body = {
        name: error.name,
        message: error.message,
        request: `${ctx.method} ${ctx.path}`,
      };
      return;
    }
    if (error.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error_code: error.status,
        errorMessage: "请先登录",
        msg: error.originalError ? error.originalError.message : error.message,
        request: `${ctx.method} ${ctx.path}`,
      };
      return;
    }
    const isHttpException = error instanceof HttpException;
    console.log(error);
    if (isHttpException) {
      ctx.status = error.code;
      ctx.body = {
        errorMessage: error.errorMessage,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`,
      };
    } else {
      ctx.response.status = 500;
      ctx.body = {
        msg: "未知错误！",
        error_code: 9999,
        request: `${ctx.method} ${ctx.path}`,
      };
    }
  }
};

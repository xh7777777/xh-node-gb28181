import User from "../models/userModel";
import { getUserTokenInfoByToken } from "../utils/authUtil";
import { AuthFailed } from "../utils/httpUtil";
import { Context, Next } from "koa";
import logUtil from "../utils/logUtil";
const logger = logUtil("Auth");

export default async function auth(ctx: Context, next: Next) {
  const token = ctx.header.authorization?.split(" ")[1];
  if (!token) {
    throw new AuthFailed("请先登录");
  }
  const username = getUserTokenInfoByToken(token);
  if (!username) {
    throw new AuthFailed("用户名不存在或权限不足");
  }
  let res = await User.findOne({
    where: {
      username,
    },
  });
  if (!res) {
    throw new AuthFailed("用户名不存在或权限不足1");
  }
  ctx.state.username = res.dataValues.username;
  ctx.state.level = res.dataValues.level;
  await next();
}

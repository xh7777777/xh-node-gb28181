import { Context, Next } from 'koa';
import { v4 } from 'uuid';
import User from '../models/userModel';
import { AuthFailed, generateToken, Existing, NotFound } from '../utils/httpUtil';
import bcrypt from 'bcrypt';
import { resolve } from '../utils/httpUtil';
import logUtil from '../utils/logUtil';
const logger = logUtil("UserController");
import { getUserTokenInfoByToken } from '../utils/authUtil';

export default class UserController {
    static async register (ctx: Context, next: Next) {
        // 注册逻辑
        registerValidation(ctx, next);
        const { username, password } = ctx.request.body;
        const result = await User.findAll({
          where: {
            username,
          },
        });
        if (result.length) {
            throw new Existing("用户名已存在", 900);
          }
        try {
            const SALT_WORK_FACTOR = 10;
            const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
            const psw = bcrypt.hashSync(password, salt);
            const id = v4();
            await User.create({
              id,
              username,
              password: psw,
              level: 0
            });
            ctx.body = resolve.success( "注册成功");
        } catch (e) {
            logger.error('注册失败', e);
            throw new AuthFailed(`注册失败`);
        }
    }

    static async login (ctx: Context, next: Next) {
        loginValidator(ctx, next);
        const { username, password } = ctx.request.body;
        // 用户是否存在
        const user = await User.findOne({
            where: {
                username
            }
        });
        if (!user) {
            throw new AuthFailed("用户名不存在");
        }
        const { password: psw } = user.dataValues;
        const correct = bcrypt.compareSync(password, psw);
        if (!correct) {
            throw new AuthFailed("密码错误");
        }
        const token = generateToken(user.username);
        ctx.body = resolve.json({
            token,
            username: user.username,
            level: user.level
        });
    }

    static async getUserInfo (ctx: Context, next: Next) {
        const username = ctx.state.username;
        const level = ctx.state.level;
        ctx.body = resolve.json({
            username,
            level
        });
    }

    static async deleteUser (ctx: Context, next: Next) {
       const level = ctx.state.level;
        deleteUserValidator(ctx, next);
        const { username } = ctx.request.body;
        // 用户是否存在
        const user = await User.findOne({
            where: {
                username
            }
        });

        if (!user) {
            throw new NotFound("用户名不存在");
        }

        if (user.dataValues.level > 0) {
            throw new AuthFailed("不能删除管理员账号");
        }

        if (level !== 1) {
            throw new AuthFailed("必须是管理员账号，权限不足");
        }
        await User.destroy({
            where: {
                username
            }
        });
        ctx.body = resolve.success("删除成功");
    
    }
}

function registerValidation (ctx: Context, next: Next) {
    // 参数校验
    ctx
    .validateBody("username")
    .required("用户名是必须的")
    .isString()
    .trim()
    .isLength(4, 16, "用户名长度必须是4~16位");
  ctx
    .validateBody("password")
    .required("密码是必填项")
    .isLength(8, 18, "密码必须是8~16位字符")
    .match(
      /^[a-zA-Z0-9_]{8,18}$/,
      "密码长度必须在8-18位之间，包含字母数字，不能包含特殊字符 "
    );
  ctx
    .validateBody("confirm")
    .required("确认密码是必填项")
    .eq(ctx.vals.password, "两次密码不一致");
}

function loginValidator(ctx: Context, next: Next) {
    ctx
      .validateBody("password")
      .required("密码是必须的")
      .trim()
      .isLength(8, 16, "密码至少8个字符，最多16个字符")
      .match(
        /^[a-zA-Z0-9_]{8,18}$/,
        "密码长度必须在8-18位之间，包含字符、数字和 _ "
      );
  }

function deleteUserValidator(ctx: Context, next: Next) {
    ctx
      .validateBody("username")
      .required("用户名是必须的")
      .isString()
      .trim()
      .isLength(4, 16, "用户名长度必须是4~16位");
  }
  
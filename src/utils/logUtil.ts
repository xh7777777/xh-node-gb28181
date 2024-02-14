import log4js from 'log4js';
import logConfig from '../config/log4js.json';

//日志工具
log4js.configure(logConfig);

export default function logUtil(name: string) {
    return log4js.getLogger(name);
};

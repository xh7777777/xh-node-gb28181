import { Sequelize } from "sequelize";
import { MYSQL_CONFIG } from "../config";
import logUtil from "../utils/logUtil";
const logger = logUtil("DB");
// 先初始化sequelize实例再引入model
export const sequelize = new Sequelize(
    'mysql',
    MYSQL_CONFIG.user || "root",
    MYSQL_CONFIG.password,
    {
      host: MYSQL_CONFIG.host || "localhost",
      dialect: "mysql",
    }
);

import Device from "../models/deviceModel";

export async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}

export async function syncModel() {
  try {
    await Device.sync({ alter: true });
    logger.info("All models were synchronized successfully.");
  } catch (error) {
    logger.error("Unable to synchronize models:", error);
  }
}
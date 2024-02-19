import { Sequelize } from "sequelize";
import { MYSQL_CONFIG } from "../config";
import logUtil from "../utils/logUtil";
const logger = logUtil("DB");
// 先初始化sequelize实例再引model
import sequelize from "../middleware/mysql";
import Device from "../models/deviceModel";
import User from "../models/userModel";

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
    await User.sync({ force: true });
    logger.info("All models were synchronized successfully.");
  } catch (error) {
    logger.error("Unable to synchronize models:", error);
  }
}
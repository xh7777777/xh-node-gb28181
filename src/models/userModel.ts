import sequelize from "../middleware/mysql";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { v4 } from "uuid";

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id?: string;
    username: string;
    password: string;
    level: number;
}

const User = sequelize.define<UserModel>(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => v4(),
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

  },
  {
    tableName: "user",
    timestamps: true,
  }
);

export default User;

import sequelize from "../middleware/mysql";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { v4 } from "uuid";

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id?: string;
    username: string;
    password: string;
}

const Device = sequelize.define<UserModel>(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => v4(),
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

export default Device;

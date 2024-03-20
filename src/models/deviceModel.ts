import sequelize from "../middleware/mysql";
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { v4 } from "uuid";

interface DeviceModel extends Model<InferAttributes<DeviceModel>, InferCreationAttributes<DeviceModel>> {
  id?: string;
  device_id: string;
  device_name: string;
  online?: boolean;
  last_online?: Date;
  sip_host: string;
  sip_port: number;
  device_ua: string;
}

const Device = sequelize.define<DeviceModel>(
  "device",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => v4(),
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    device_name: {
      type: DataTypes.STRING,
    },
    online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_online: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    sip_host: {
      type: DataTypes.STRING,
    },
    sip_port: {
      type: DataTypes.INTEGER,
    },
    device_ua: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "hotel",
    timestamps: true,
  }
);

export default Device;

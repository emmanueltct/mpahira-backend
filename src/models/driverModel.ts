import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface DriverAttributes {
  id: string;
  firstName: string;
  lastName: string;
  telephone: string;
  plateNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DriverCreationAttributes extends Optional<DriverAttributes, "id"> {}

class Driver extends Model<DriverAttributes, DriverCreationAttributes>
  implements DriverAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public telephone!: string;
  public plateNumber!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Driver.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Driver",
    tableName: "drivers",
  }
);

export default Driver;

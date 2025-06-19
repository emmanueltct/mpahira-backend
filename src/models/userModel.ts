// models/userModel.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // adjust to your setup
import { UserAttributes } from '../interfaces/userInterface';
import Role from './roleModel';


type UserCreationAttributes = Optional<UserAttributes, 'id' | 'password' | 'profilePic' | 'otp' | 'otpExpires' | 'accessToken' | 'refreshToken' | 'createdAt' | 'updatedAt'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public telephone!: string;
  public email!: string;
  public password?: string;
  public profilePic?: string;
  public provider!: 'local' | 'google';
  public roleId!: string;
  public otp?: string;
  public otpExpires?: Date;
  public accessToken?: string;
  public refreshToken?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

User.init(
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
      validate: {
        is: /^(078|079|072|073)\d{7}$/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false,
    },
    roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

User.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role',
});

export default User;


import { Dialect } from 'sequelize';
 import dotenv from "dotenv";
dotenv.config();

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  logging?: boolean;
  port?:number
}

interface ConfigGroup {
  development: DBConfig;
  test?: DBConfig;
  production?: DBConfig;
}



const config: ConfigGroup = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mpahira',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'TEST',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'PROD',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
  },
};

export default config;

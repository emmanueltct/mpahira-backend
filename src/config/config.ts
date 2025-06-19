
import { Dialect } from 'sequelize';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  logging?: boolean;
}

interface ConfigGroup {
  development: DBConfig;
  test?: DBConfig;
  production?: DBConfig;
}

const config:ConfigGroup= {
  development: {
    username: 'root',
    password: '',
    database: 'mpahira',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: '',
    database: 'TEST',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: '',
    database: 'PROD',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

export default config;

import { Sequelize } from "sequelize";
import dotenv from "./dotenv";

const sequelize = new Sequelize(dotenv.DB_NAME,dotenv.DB_USER,dotenv.DB_PASSWORD,{
    host:dotenv.DB_HOST,
    dialect:"mysql"
}
   )
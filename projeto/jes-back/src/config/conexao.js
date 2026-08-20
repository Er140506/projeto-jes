import "dotenv/config"
import { Sequelize } from "sequelize";

export const conexao = new Sequelize(
    process.env.DB_NAME = "jes",
    process.env.DB_USER = "root",
    process.env.DB_PASS = "123456789",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: true
    }
)
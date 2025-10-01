import { Sequelize } from "sequelize";
import { config } from "../config";

console.log('Database config:', {
  database: config.databaseName,
  user: config.username,
  host: config.host
});


export const sequelize = new Sequelize(
    config.databaseName,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql',
        logging: console.log,
        define: {
            timestamps: false,
            underscored: true
        }
    },
)
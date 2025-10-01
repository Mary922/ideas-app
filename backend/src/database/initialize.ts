import { sequelize } from "./connection";
// import { Sequelize } from "sequelize";



export const initializeDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        
        await sequelize.sync({ alter: true});
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};


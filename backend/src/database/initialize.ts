import { sequelize } from "./connection";
import { Sequelize, QueryTypes } from "sequelize";
import { Idea, initIdeasModel } from "./models/ideas.model";
import { initVotesModel, Vote } from "./models/votes.model";


export function initModels(sequelize: Sequelize) {
  initIdeasModel(sequelize);
  initVotesModel(sequelize);

  Idea.hasMany(Vote, { foreignKey: 'idea_id', as: 'votes' });
  Vote.belongsTo(Idea, { foreignKey: 'idea_id', as: 'idea' });

  return {
    Idea,
    Vote
  };
}

export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    const tableExists = await checkIfTableExists('votes');
    if (!tableExists) {
      console.log('Table "votes" does not exist. Creating...');

      await Vote.sync({ force: false });
      console.log('Table "votes" created successfully.');
    } else {
      console.log('Table "votes" already exists.');
    }

    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    const databaseName = process.env.DB_NAME;

    const result = await sequelize.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = ? 
            AND table_name = ?
        `, {
      replacements: [databaseName, tableName],
      type: QueryTypes.SELECT
    });

    return (result[0] as any).count > 0;

  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}
export { Idea, Vote }


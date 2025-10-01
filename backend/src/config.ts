import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем путь к .env файлу

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config();

export interface IConfig {
  databaseName: string;
  username: string;
  password: string;
  host: string;
  dialect: string;
  logging: boolean;
  define?: {
    timestamps?: boolean;
  };
  jwtSecret: string
}

export const config: IConfig = {
    databaseName: process.env.DB_NAME || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '',
    dialect: 'mysql',
    logging: true,
    define: {
        timestamps: false
    },
    jwtSecret: process.env.JWT_SECRET || ''
};


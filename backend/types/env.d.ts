
declare namespace NodeJS {
    interface ProcessEnv {
    // Server
    readonly PORT: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
    
    // Database
    readonly DB_HOST: string;
    readonly DB_PORT: string;
    readonly DB_NAME: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_DIALECT: string;
    
    // JWT
    readonly JWT_SECRET: string;
    readonly JWT_EXPIRE: string;
    
    // CORS
    readonly FRONTEND_URL: string;
  } 
}

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  NODE_ENV: string;
  CLIENT_URL: string;
}

const getEnvConfig = (): EnvConfig => {
  return {
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/rinkhata',
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_in_production',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  };
};

export const config = getEnvConfig();

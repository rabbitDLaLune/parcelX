import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env['PORT']) || 5000,
  frontendUrl: process.env['FRONTEND_URL'] || 'http://localhost:4200',

  db: {
    host: process.env['DB_HOST'] || 'localhost',
    port: Number(process.env['DB_PORT']) || 3306,
    user: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASSWORD'] || '',
    database: process.env['DB_NAME'] || 'parcelx_db',
  },

  jwt: {
    secret: process.env['JWT_SECRET'] || 'parcelx_default_secret',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '1d',
  },
};

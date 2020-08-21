import { config as dotenvConfig } from 'dotenv'
import { PoolConfig } from 'pg'
dotenvConfig()

const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
}

export const config = {
  db: dbConfig
}

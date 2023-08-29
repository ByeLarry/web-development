import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});

const sendSQLRequest = async (SQLquery: string): Promise<any[]> => {
  const response = await pool.query(SQLquery);
  return JSON.parse(JSON.stringify(response.rows));
};

export = sendSQLRequest;

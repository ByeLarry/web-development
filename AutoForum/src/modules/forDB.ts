import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "forum_db",
  password: "1",
  port: 5432
});

const sendSQLRequest = async (SQLquery: string): Promise<any[]> => {
    const response = await pool.query(SQLquery);
    return JSON.parse(JSON.stringify(response.rows));
  }


export = sendSQLRequest;

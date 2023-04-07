import { Pool } from "pg";


const sendSQLRequest = async (SQLquery: string, pool: any): Promise<any[]> => {
    const response = await pool.query(SQLquery);
    return JSON.parse(JSON.stringify(response.rows));
  }


export = sendSQLRequest;

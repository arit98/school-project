import mysql from "mysql2/promise";

export async function connectDB() {
  const connection = await mysql.createConnection({
    host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "tRriernsbt3hAua.root",
    password: "VhJWoWAcUupM5atp",
    database: "schooldb",
    ssl: { rejectUnauthorized: true },
  });
  return connection;
}

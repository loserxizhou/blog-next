/**
 * 数据库迁移脚本
 *
 * 由于 Prisma CLI 与 PgBouncer 事务池模式有兼容性问题，
 * 使用此脚本通过 pg 客户端直接执行 SQL 迁移。
 *
 * 使用方法：
 *   node scripts/db-migrate.js "SQL语句"
 *
 * 示例：
 *   node scripts/db-migrate.js "ALTER TABLE \"Doc\" ADD COLUMN \"views\" INTEGER DEFAULT 0"
 *   node scripts/db-migrate.js "CREATE TABLE \"Example\" (\"id\" TEXT PRIMARY KEY)"
 */

require('dotenv').config();
const { Client } = require('pg');

async function migrate() {
  const sql = process.argv[2];

  if (!sql) {
    console.log('用法: node scripts/db-migrate.js "SQL语句"');
    console.log('');
    console.log('示例:');
    console.log('  node scripts/db-migrate.js "ALTER TABLE \\"Doc\\" ADD COLUMN \\"views\\" INTEGER DEFAULT 0"');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('连接数据库...');
    await client.connect();
    console.log('已连接\n');

    console.log('执行 SQL:');
    console.log(sql);
    console.log('');

    const result = await client.query(sql);
    console.log('执行成功!');

    if (result.rows && result.rows.length > 0) {
      console.log('结果:', result.rows);
    }
  } catch (err) {
    console.error('执行失败:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();

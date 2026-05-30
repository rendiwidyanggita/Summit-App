import "dotenv/config";
import pg from "pg";

const { Client } = pg;

async function connect(name, connectionString) {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const version = await client.query("select current_database() as db, current_schema() as schema, version() as version");
  await client.end();

  return {
    name,
    db: version.rows[0].db,
    schema: version.rows[0].schema,
    version: String(version.rows[0].version).split(" ").slice(0, 2).join(" "),
  };
}

async function listPublicTables() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const result = await client.query(
    "select table_name from information_schema.tables where table_schema = $1 and table_type = $2 order by table_name",
    ["public", "BASE TABLE"],
  );
  await client.end();

  return result.rows.map((row) => row.table_name);
}

async function countFoundationTables() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const tables = ["Role", "Permission", "Category", "Brand", "Product", "ProductVariant", "Banner"];
  const counts = {};

  for (const table of tables) {
    const result = await client.query(`select count(*)::int as count from "${table}"`);
    counts[table] = result.rows[0].count;
  }

  await client.end();
  return counts;
}

const checks = [];

if (process.env.DIRECT_URL) {
  checks.push(await connect("DIRECT_URL", process.env.DIRECT_URL));
}

if (process.env.DATABASE_URL) {
  checks.push(await connect("DATABASE_URL", process.env.DATABASE_URL));
}

const publicTables = await listPublicTables();
const foundationCounts = await countFoundationTables();

console.log(
  JSON.stringify(
    {
      connections: checks,
      publicTables,
      foundationCounts,
    },
    null,
    2,
  ),
);

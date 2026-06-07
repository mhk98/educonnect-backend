require("dotenv").config();
const db = require("../models");

const tables = [
  "ExternalConversations",
  "ExternalMessages",
  "ChatConversations",
  "ChatMessages",
];

async function run() {
  try {
    await db.sequelize.authenticate();
    console.log("DB connected");

    for (const table of tables) {
      try {
        const [rows] = await db.sequelize.query(`DESCRIBE \`${table}\``);
        const hasDeletedAt = rows.some((r) => r.Field === "deletedAt");

        if (hasDeletedAt) {
          console.log(`✅ ${table}: deletedAt already exists — skipped`);
        } else {
          await db.sequelize.query(
            `ALTER TABLE \`${table}\` ADD COLUMN deletedAt DATETIME NULL DEFAULT NULL`,
          );
          console.log(`✅ ${table}: deletedAt added`);
        }
      } catch (err) {
        console.error(`❌ ${table}: ${err.message}`);
      }
    }

    console.log("\nDone. Restart the server.");
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
}

run();

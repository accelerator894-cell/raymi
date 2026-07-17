/**
 * 生产环境初始化：执行数据库迁移，并在 posts 表为空时写入种子文章。
 * 用法: npx tsx db/prod-setup.ts
 */
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { posts } from "./schema";
import { seedPosts } from "./seed-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("缺少 DATABASE_URL 环境变量");

  const db = drizzle(url);

  console.log("[setup] 正在执行数据库迁移...");
  await migrate(db, { migrationsFolder: path.join(__dirname, "migrations") });
  console.log("[setup] 迁移完成");

  const existing = await db.select({ id: posts.id }).from(posts).limit(1);
  if (existing.length === 0) {
    console.log("[setup] posts 表为空，写入种子文章...");
    await db.insert(posts).values(seedPosts);
    console.log(`[setup] 已写入 ${seedPosts.length} 篇文章`);
  } else {
    console.log("[setup] 已有文章数据，跳过种子写入");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("[setup] 初始化失败:", err);
  process.exit(1);
});

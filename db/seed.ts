/**
 * 开发环境播种：posts 表为空时写入种子文章。
 * 用法: npx tsx db/seed.ts
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { posts } from "./schema";
import { seedPosts } from "./seed-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("缺少 DATABASE_URL 环境变量");

  const db = drizzle(url);
  const existing = await db.select({ id: posts.id }).from(posts).limit(1);
  if (existing.length > 0) {
    console.log("[seed] 已有文章数据，跳过");
    process.exit(0);
  }
  await db.insert(posts).values(seedPosts);
  console.log(`[seed] 已写入 ${seedPosts.length} 篇文章`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] 失败:", err);
  process.exit(1);
});

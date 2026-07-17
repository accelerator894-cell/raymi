import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

export const posts = mysqlTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: varchar("summary", { length: 500 }).notNull().default(""),
  content: text("content").notNull(),
  cover: varchar("cover", { length: 500 }).notNull().default(""),
  // 逗号分隔的标签，如 "边缘行者,人物志"
  tags: varchar("tags", { length: 255 }).notNull().default(""),
  category: varchar("category", { length: 100 }).notNull().default("夜城杂谈"),
  published: boolean("published").notNull().default(true),
  views: int("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const comments = mysqlTable("comments", {
  id: serial("id").primaryKey(),
  // FK 引用 serial() PK，必须是 bigint unsigned
  postId: bigint("post_id", { mode: "number", unsigned: true }).notNull(),
  nickname: varchar("nickname", { length: 80 }).notNull(),
  content: varchar("content", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;

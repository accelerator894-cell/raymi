import { desc, eq, like, or, and, sql } from "drizzle-orm";
import { getDb } from "./connection";
import { posts } from "@db/schema";

export async function listPublishedPosts(opts: {
  page: number;
  pageSize: number;
  tag?: string;
  keyword?: string;
}) {
  const { page, pageSize, tag, keyword } = opts;
  const conditions = [eq(posts.published, true)];
  if (tag) conditions.push(like(posts.tags, `%${tag}%`));
  if (keyword) {
    conditions.push(
      or(
        like(posts.title, `%${keyword}%`),
        like(posts.summary, `%${keyword}%`),
        like(posts.content, `%${keyword}%`),
      )!,
    );
  }
  const where = and(...conditions);
  const db = getDb();
  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(where),
  ]);
  return { items, total: Number(count) };
}

export async function listAllPosts() {
  return getDb().select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostBySlug(slug: string) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getPostById(id: number) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function incrementViews(id: number) {
  await getDb()
    .update(posts)
    .set({ views: sql`${posts.views} + 1` })
    .where(eq(posts.id, id));
}

export async function listTags() {
  const rows = await getDb()
    .select({ tags: posts.tags })
    .from(posts)
    .where(eq(posts.published, true));
  const counter = new Map<string, number>();
  for (const row of rows) {
    for (const tag of row.tags.split(",")) {
      const t = tag.trim();
      if (t) counter.set(t, (counter.get(t) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function createPost(data: {
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover: string;
  tags: string;
  category: string;
  published: boolean;
}) {
  const result = await getDb().insert(posts).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updatePost(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    summary: string;
    content: string;
    cover: string;
    tags: string;
    category: string;
    published: boolean;
  }>,
) {
  await getDb().update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  await getDb().delete(posts).where(eq(posts.id, id));
}

import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "./connection";
import { comments } from "@db/schema";

export async function listComments(postId: number) {
  return getDb()
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt))
    .limit(200);
}

export async function createComment(data: {
  postId: number;
  nickname: string;
  content: string;
}) {
  const result = await getDb().insert(comments).values(data);
  return { id: Number(result[0].insertId) };
}

export async function listAllComments() {
  return getDb()
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt))
    .limit(200);
}

export async function deleteComment(id: number) {
  await getDb().delete(comments).where(eq(comments.id, id));
}

export async function countCommentsByPost(postIds: number[]) {
  if (postIds.length === 0) return new Map<number, number>();
  const rows = await getDb()
    .select({ postId: comments.postId, count: sql<number>`count(*)` })
    .from(comments)
    .where(
      sql`${comments.postId} in (${sql.join(
        postIds.map((id) => sql`${id}`),
        sql`, `,
      )})`,
    )
    .groupBy(comments.postId);
  return new Map(rows.map((r) => [Number(r.postId), Number(r.count)]));
}

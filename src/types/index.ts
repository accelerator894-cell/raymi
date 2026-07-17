import type { Post, Comment } from "@db/schema";

export type { Post, Comment };

export type PostWithCount = Post & { commentCount: number };

export type AdminComment = Comment & { postTitle: string };

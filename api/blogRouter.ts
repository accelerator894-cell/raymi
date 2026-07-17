import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware";
import {
  adminProcedure,
  adminCredentials,
  signAdminToken,
  buildAdminCookie,
  buildClearCookie,
  isAdminRequest,
} from "./adminAuth";
import {
  listPublishedPosts,
  listAllPosts,
  getPostBySlug,
  getPostById,
  incrementViews,
  listTags,
  createPost,
  updatePost,
  deletePost,
} from "./queries/posts";
import {
  listComments,
  listAllComments,
  createComment,
  deleteComment,
  countCommentsByPost,
} from "./queries/comments";

const postInput = z.object({
  title: z.string().min(1, "标题不能为空").max(255),
  slug: z
    .string()
    .min(1, "slug 不能为空")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符"),
  summary: z.string().max(500).default(""),
  content: z.string().min(1, "正文不能为空"),
  cover: z.string().max(500).default(""),
  tags: z.string().max(255).default(""),
  category: z.string().max(100).default("夜城杂谈"),
  published: z.boolean().default(true),
});

export const blogRouter = createRouter({
  // ---------- 管理员认证 ----------
  login: publicQuery
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(({ input, ctx }) => {
      const creds = adminCredentials();
      if (
        input.username !== creds.username ||
        input.password !== creds.password
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "账号或密码错误",
        });
      }
      const token = signAdminToken(input.username);
      ctx.resHeaders.set("Set-Cookie", buildAdminCookie(token));
      return { ok: true };
    }),

  logout: publicQuery.mutation(({ ctx }) => {
    ctx.resHeaders.set("Set-Cookie", buildClearCookie());
    return { ok: true };
  }),

  me: publicQuery.query(({ ctx }) => ({
    isAdmin: isAdminRequest(ctx.req),
  })),

  // ---------- 文章（公开） ----------
  list: publicQuery
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(50).default(10),
        tag: z.string().optional(),
        keyword: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { items, total } = await listPublishedPosts(input);
      const counts = await countCommentsByPost(items.map((p) => p.id));
      return {
        items: items.map((p) => ({ ...p, commentCount: counts.get(p.id) ?? 0 })),
        total,
        page: input.page,
        pageSize: input.pageSize,
      };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getPostBySlug(input.slug);
      if (!post || !post.published) {
        throw new TRPCError({ code: "NOT_FOUND", message: "文章不存在" });
      }
      await incrementViews(post.id);
      return { ...post, views: post.views + 1 };
    }),

  tags: publicQuery.query(() => listTags()),

  // ---------- 评论（公开） ----------
  comments: publicQuery
    .input(z.object({ postId: z.number() }))
    .query(({ input }) => listComments(input.postId)),

  addComment: publicQuery
    .input(
      z.object({
        postId: z.number(),
        nickname: z.string().trim().min(1, "请填写昵称").max(80),
        content: z.string().trim().min(1, "评论不能为空").max(1000),
      }),
    )
    .mutation(async ({ input }) => {
      const post = await getPostById(input.postId);
      if (!post || !post.published) {
        throw new TRPCError({ code: "NOT_FOUND", message: "文章不存在" });
      }
      return createComment(input);
    }),

  // ---------- 文章（管理员） ----------
  listAdmin: adminProcedure.query(async () => {
    const items = await listAllPosts();
    const counts = await countCommentsByPost(items.map((p) => p.id));
    return items.map((p) => ({ ...p, commentCount: counts.get(p.id) ?? 0 }));
  }),

  byId: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await getPostById(input.id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  create: adminProcedure.input(postInput).mutation(async ({ input }) => {
    const existing = await getPostBySlug(input.slug);
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "slug 已被占用，请换一个",
      });
    }
    return createPost(input);
  }),

  update: adminProcedure
    .input(z.object({ id: z.number(), data: postInput.partial() }))
    .mutation(async ({ input }) => {
      if (input.data.slug) {
        const existing = await getPostBySlug(input.data.slug);
        if (existing && existing.id !== input.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "slug 已被占用，请换一个",
          });
        }
      }
      await updatePost(input.id, input.data);
      return { ok: true };
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePost(input.id);
      return { ok: true };
    }),

  removeComment: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteComment(input.id);
      return { ok: true };
    }),

  commentsAdmin: adminProcedure.query(async () => {
    const [items, allPosts] = await Promise.all([
      listAllComments(),
      listAllPosts(),
    ]);
    const postMap = new Map(allPosts.map((p) => [p.id, p.title]));
    return items.map((c) => ({
      ...c,
      postTitle: postMap.get(c.postId) ?? "（已删除的文章）",
    }));
  }),
});

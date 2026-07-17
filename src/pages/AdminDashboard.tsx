import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { GlitchText } from "@/components/cyber/GlitchText";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Eye,
  MessageSquare,
  FileText,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [tab, setTab] = useState<"posts" | "comments">("posts");

  const me = trpc.blog.me.useQuery();
  const posts = trpc.blog.listAdmin.useQuery(undefined, {
    enabled: me.data?.isAdmin === true,
    retry: false,
  });
  const comments = trpc.blog.commentsAdmin.useQuery(undefined, {
    enabled: me.data?.isAdmin === true && tab === "comments",
    retry: false,
  });

  const logout = trpc.blog.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate("/");
    },
  });
  const removePost = trpc.blog.remove.useMutation({
    onSuccess: () => {
      utils.blog.listAdmin.invalidate();
      utils.blog.list.invalidate();
    },
  });
  const togglePublish = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.listAdmin.invalidate();
      utils.blog.list.invalidate();
    },
  });
  const removeComment = trpc.blog.removeComment.useMutation({
    onSuccess: () => utils.blog.commentsAdmin.invalidate(),
  });

  useEffect(() => {
    if (me.data && !me.data.isAdmin) navigate("/admin/login", { replace: true });
  }, [me.data, navigate]);

  if (!me.data?.isAdmin) {
    return (
      <div className="py-32 text-center font-mono text-cyber-cyan">
        正在验证权限<span className="type-cursor" />
      </div>
    );
  }

  const items = posts.data ?? [];
  const totalViews = items.reduce((s, p) => s + p.views, 0);
  const totalComments = items.reduce((s, p) => s + p.commentCount, 0);
  const drafts = items.filter((p) => !p.published).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* 页头 */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-xs tracking-[0.3em] text-cyber-pink/70">
            &gt; ROOT ACCESS GRANTED
          </p>
          <h1 className="text-3xl font-black tracking-wider">
            <GlitchText text="控制台" staticMode className="neon-pink" />
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/new"
            className="clip-corner-sm flex items-center gap-2 bg-cyber-yellow px-5 py-2.5 font-mono text-sm font-bold text-cyber-dark transition-all hover:bg-cyber-cyan"
          >
            <Plus className="h-4 w-4" /> 新建文章
          </Link>
          <button
            onClick={() => logout.mutate()}
            className="clip-corner-sm flex items-center gap-2 border border-cyber-line px-4 py-2.5 font-mono text-sm text-foreground/60 transition-colors hover:border-cyber-pink hover:text-cyber-pink"
          >
            <LogOut className="h-4 w-4" /> 断开连接
          </button>
        </div>
      </div>

      {/* 统计 */}
      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: FileText, label: "文章总数", value: items.length, color: "#fcee0a" },
          { icon: Eye, label: "总浏览量", value: totalViews, color: "#00f0ff" },
          { icon: MessageSquare, label: "评论总数", value: totalComments, color: "#39ff14" },
          { icon: EyeOff, label: "草稿", value: drafts, color: "#ff2a6d" },
        ].map((s) => (
          <div key={s.label} className="cyber-card p-4">
            <div className="mb-1 flex items-center gap-2 font-mono text-[10px] tracking-widest text-foreground/40">
              <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
              {s.label}
            </div>
            <p className="font-mono text-2xl font-black" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* 标签页 */}
      <div className="mb-6 flex gap-2 border-b border-cyber-line">
        {(
          [
            { key: "posts", label: "文章管理" },
            { key: "comments", label: "评论管理" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative px-5 py-2.5 font-mono text-sm tracking-wider transition-colors",
              tab === t.key ? "text-cyber-yellow" : "text-foreground/45 hover:text-foreground",
            )}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-cyber-yellow shadow-[0_0_8px_#fcee0a]" />
            )}
          </button>
        ))}
      </div>

      {/* 文章表格 */}
      {tab === "posts" && (
        <div className="overflow-x-auto border border-cyber-line">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-cyber-line bg-cyber-panel/80 font-mono text-xs text-foreground/45">
                <th className="px-4 py-3 text-left">标题</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-right">浏览</th>
                <th className="px-4 py-3 text-right">评论</th>
                <th className="px-4 py-3 text-left">创建时间</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-cyber-line/50 transition-colors hover:bg-cyber-panel/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/posts/${p.slug}`}
                      className="font-bold text-foreground/85 hover:text-cyber-yellow"
                    >
                      {p.title}
                    </Link>
                    <p className="font-mono text-[11px] text-foreground/35">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "clip-tag px-2 py-0.5 font-mono text-[11px] font-bold",
                        p.published
                          ? "bg-cyber-green/15 text-cyber-green"
                          : "bg-cyber-pink/15 text-cyber-pink",
                      )}
                    >
                      {p.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground/60">{p.views}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground/60">
                    {p.commentCount}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground/45">
                    {new Date(p.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        title={p.published ? "转为草稿" : "发布"}
                        onClick={() =>
                          togglePublish.mutate({
                            id: p.id,
                            data: { published: !p.published },
                          })
                        }
                        className="border border-cyber-line p-1.5 text-foreground/55 transition-colors hover:border-cyber-cyan hover:text-cyber-cyan"
                      >
                        {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link
                        to={`/admin/edit/${p.id}`}
                        title="编辑"
                        className="border border-cyber-line p-1.5 text-foreground/55 transition-colors hover:border-cyber-yellow hover:text-cyber-yellow"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        title="删除"
                        onClick={() => {
                          if (confirm(`确定删除「${p.title}」？此操作不可恢复。`)) {
                            removePost.mutate({ id: p.id });
                          }
                        }}
                        className="border border-cyber-line p-1.5 text-foreground/55 transition-colors hover:border-cyber-pink hover:text-cyber-pink"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center font-mono text-foreground/40">
                    暂无文章 —— 点击右上角「新建文章」发出第一条信号
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 评论管理 */}
      {tab === "comments" && (
        <div className="space-y-3">
          {(comments.data ?? []).map((c) => (
            <div key={c.id} className="cyber-card flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="mb-1 font-mono text-xs text-foreground/40">
                  <span className="font-bold text-cyber-cyan">{c.nickname}</span>
                  {" 评论于 "}
                  <span className="text-cyber-yellow">「{c.postTitle}」</span>
                  {" · "}
                  {new Date(c.createdAt).toLocaleString("zh-CN", { hour12: false })}
                </p>
                <p className="text-sm leading-6 text-foreground/75">{c.content}</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("确定删除这条评论？")) removeComment.mutate({ id: c.id });
                }}
                className="shrink-0 border border-cyber-line p-1.5 text-foreground/55 transition-colors hover:border-cyber-pink hover:text-cyber-pink"
                title="删除评论"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {(comments.data ?? []).length === 0 && (
            <p className="border border-dashed border-cyber-line py-12 text-center font-mono text-foreground/40">
              暂无评论
            </p>
          )}
        </div>
      )}
    </div>
  );
}

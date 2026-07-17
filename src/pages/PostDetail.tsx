import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Markdown } from "@/components/Markdown";
import { CommentsSection } from "@/components/CommentsSection";
import { GlitchText } from "@/components/cyber/GlitchText";
import { ChevronLeft, Eye, CalendarDays, Tag } from "lucide-react";

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = trpc.blog.bySlug.useQuery({ slug: slug ?? "" }, { enabled: !!slug });
  const me = trpc.blog.me.useQuery();

  if (post.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center font-mono text-cyber-cyan">
        正在解密信号<span className="type-cursor" />
      </div>
    );
  }

  if (post.error || !post.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <p className="mb-4 font-mono text-6xl font-black text-cyber-pink">404</p>
        <p className="mb-8 text-foreground/60">信号丢失 —— 这篇文章不存在或已被荒坂抹除。</p>
        <Link
          to="/posts"
          className="clip-corner-sm inline-flex items-center gap-2 border border-cyber-cyan px-5 py-2 font-mono text-sm text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark"
        >
          <ChevronLeft className="h-4 w-4" /> 返回档案
        </Link>
      </div>
    );
  }

  const p = post.data;
  const tags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/posts"
        className="mb-8 inline-flex items-center gap-1 font-mono text-xs text-foreground/45 transition-colors hover:text-cyber-cyan"
      >
        <ChevronLeft className="h-4 w-4" /> 返回信号档案
      </Link>

      {/* 文章头 */}
      <header className="mb-10 border-b border-cyber-line pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="clip-tag bg-cyber-yellow px-2.5 py-1 font-bold text-cyber-dark">
            {p.category}
          </span>
          <span className="flex items-center gap-1 text-foreground/45">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(p.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <span className="flex items-center gap-1 text-foreground/45">
            <Eye className="h-3.5 w-3.5" /> {p.views} 次接入
          </span>
        </div>
        <h1 className="mb-5 text-3xl font-black leading-snug md:text-4xl">
          <GlitchText text={p.title} staticMode className="neon-yellow" />
        </h1>
        {tags.length > 0 && (
          <p className="flex items-center gap-2 font-mono text-xs text-cyber-pink/80">
            <Tag className="h-3.5 w-3.5" />
            {tags.map((t) => `#${t}`).join("  ")}
          </p>
        )}
      </header>

      {/* 正文 */}
      <Markdown content={p.content} />

      {/* 评论区 */}
      <CommentsSection postId={p.id} isAdmin={me.data?.isAdmin ?? false} />
    </div>
  );
}

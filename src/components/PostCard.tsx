import { Link } from "react-router";
import { Eye, MessageSquare, ChevronRight } from "lucide-react";
import type { PostWithCount } from "@/types";

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function PostCard({ post, index }: { post: PostWithCount; index: number }) {
  const tags = post.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <Link to={`/posts/${post.slug}`} className="group block">
      <article className="cyber-card clip-corner relative h-full p-5">
        {/* 编号装饰 */}
        <span className="absolute right-3 top-2 font-mono text-4xl font-black text-cyber-line/60 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="mb-3 flex items-center gap-2 font-mono text-[11px]">
          <span className="clip-tag bg-cyber-yellow px-2 py-0.5 font-bold text-cyber-dark">
            {post.category}
          </span>
          <span className="text-cyber-cyan/60">{formatDate(post.createdAt)}</span>
        </div>

        <h3 className="mb-2 pr-10 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-cyber-yellow">
          {post.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm leading-6 text-foreground/55">
          {post.summary}
        </p>

        <div className="flex items-center justify-between border-t border-cyber-line/60 pt-3">
          <div className="flex flex-wrap gap-2 font-mono text-[11px] text-cyber-pink/80">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-foreground/45">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {post.commentCount}
            </span>
            <ChevronRight className="h-4 w-4 text-cyber-yellow opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </article>
    </Link>
  );
}

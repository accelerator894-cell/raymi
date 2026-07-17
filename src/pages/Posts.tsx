import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { PostCard } from "@/components/PostCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export default function Posts() {
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState<string | undefined>();
  const [keyword, setKeyword] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const list = trpc.blog.list.useQuery({
    page,
    pageSize: PAGE_SIZE,
    tag,
    keyword: keyword || undefined,
  });
  const tags = trpc.blog.tags.useQuery();

  const totalPages = list.data ? Math.max(1, Math.ceil(list.data.total / PAGE_SIZE)) : 1;

  const selectTag = (t?: string) => {
    setTag(t);
    setPage(1);
  };

  const doSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* 页头 */}
      <header className="mb-10">
        <p className="mb-2 font-mono text-xs tracking-[0.3em] text-cyber-cyan/70">
          &gt; ACCESSING ARCHIVES...
        </p>
        <h1 className="text-4xl font-black tracking-wider md:text-5xl">
          <GlitchText text="信号档案" className="neon-yellow" />
        </h1>
        <p className="mt-2 font-mono text-sm text-foreground/45">
          // 共截获 {list.data?.total ?? "..."} 条加密信号
        </p>
      </header>

      {/* 搜索 */}
      <form onSubmit={doSearch} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="搜索信号内容……"
            className="w-full border border-cyber-line bg-cyber-panel/70 py-2.5 pl-10 pr-4 font-mono text-sm outline-none transition-colors placeholder:text-foreground/30 focus:border-cyber-cyan"
          />
        </div>
        <button
          type="submit"
          className="clip-corner-sm bg-cyber-cyan px-6 font-mono text-sm font-bold text-cyber-dark transition-all hover:bg-cyber-yellow"
        >
          扫描
        </button>
      </form>

      {/* 标签 */}
      <div className="mb-10 flex flex-wrap gap-2">
        <TagChip active={!tag} onClick={() => selectTag(undefined)}>
          全部
        </TagChip>
        {tags.data?.map((t) => (
          <TagChip key={t.name} active={tag === t.name} onClick={() => selectTag(t.name)}>
            #{t.name}
            <span className="ml-1 opacity-60">{t.count}</span>
          </TagChip>
        ))}
      </div>

      {/* 列表 */}
      {list.isLoading && (
        <p className="py-20 text-center font-mono text-cyber-cyan">
          正在解密数据<span className="type-cursor" />
        </p>
      )}
      {list.data?.items.length === 0 && (
        <p className="border border-dashed border-cyber-line py-20 text-center font-mono text-foreground/40">
          没有找到匹配的信号 —— 换个频段试试？
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.data?.items.map((post, i) => (
          <PostCard key={post.id} post={post} index={(page - 1) * PAGE_SIZE + i} />
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4 font-mono text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="clip-corner-sm flex items-center gap-1 border border-cyber-line px-4 py-2 text-foreground/70 transition-colors hover:border-cyber-cyan hover:text-cyber-cyan disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> 上一页
          </button>
          <span className="text-cyber-yellow">
            {page} <span className="text-foreground/40">/ {totalPages}</span>
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="clip-corner-sm flex items-center gap-1 border border-cyber-line px-4 py-2 text-foreground/70 transition-colors hover:border-cyber-cyan hover:text-cyber-cyan disabled:opacity-30"
          >
            下一页 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function TagChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "clip-tag border px-3 py-1.5 font-mono text-xs transition-all",
        active
          ? "border-cyber-pink bg-cyber-pink text-cyber-dark font-bold"
          : "border-cyber-line text-foreground/55 hover:border-cyber-pink/60 hover:text-cyber-pink",
      )}
    >
      {children}
    </button>
  );
}

import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = ["#fcee0a", "#00f0ff", "#ff2a6d", "#39ff14", "#b537f2", "#ff9f1c"];

function formatTime(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString("zh-CN", { hour12: false });
}

export function CommentsSection({
  postId,
  isAdmin = false,
}: {
  postId: number;
  isAdmin?: boolean;
}) {
  const utils = trpc.useUtils();
  const comments = trpc.blog.comments.useQuery({ postId });
  const addComment = trpc.blog.addComment.useMutation({
    onSuccess: () => {
      utils.blog.comments.invalidate({ postId });
      setNickname("");
      setContent("");
    },
  });
  const removeComment = trpc.blog.removeComment.useMutation({
    onSuccess: () => {
      utils.blog.comments.invalidate({ postId });
      utils.blog.commentsAdmin.invalidate();
    },
  });

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nickname.trim() || !content.trim()) {
      setError("昵称和评论内容都不能为空");
      return;
    }
    addComment.mutate(
      { postId, nickname: nickname.trim(), content: content.trim() },
      { onError: (err) => setError(err.message) },
    );
  };

  return (
    <section className="mt-14">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-black tracking-wider">
        <MessageSquare className="h-5 w-5 text-cyber-cyan" />
        <span className="neon-cyan">神经连接</span>
        <span className="font-mono text-xs text-foreground/40">
          // {comments.data?.length ?? 0} 条留言
        </span>
      </h2>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.data?.length === 0 && (
          <p className="border border-dashed border-cyber-line p-6 text-center font-mono text-sm text-foreground/40">
            暂无信号接入 —— 来抢沙发，佣兵。
          </p>
        )}
        {comments.data?.map((c, i) => {
          const color = AVATAR_COLORS[c.nickname.length % AVATAR_COLORS.length];
          return (
            <div key={c.id} className="cyber-card flex gap-3 p-4">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center clip-corner-sm text-sm font-black text-cyber-dark"
                style={{ background: color }}
              >
                {c.nickname.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="font-bold text-sm" style={{ color }}>
                    {c.nickname}
                    <span className="ml-2 font-mono text-[10px] font-normal text-foreground/35">
                      #{String((comments.data?.length ?? 0) - i).padStart(3, "0")}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[11px] text-foreground/35">
                    {formatTime(c.createdAt)}
                    {isAdmin && (
                      <button
                        onClick={() => removeComment.mutate({ id: c.id })}
                        className="text-cyber-pink/70 hover:text-cyber-pink"
                        title="删除评论"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                  {c.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 发表评论 */}
      <form onSubmit={submit} className="cyber-card clip-corner mt-6 p-5">
        <p className="mb-4 font-mono text-xs tracking-widest text-cyber-yellow">
          &gt; 建立新的神经连接_
        </p>
        <div className="mb-3">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={80}
            placeholder="你的街头代号（昵称）"
            className="w-full border border-cyber-line bg-cyber-dark/80 px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-cyber-cyan"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="说点什么……（别剧透，算我求你）"
          className="mb-3 w-full resize-y border border-cyber-line bg-cyber-dark/80 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-cyber-cyan"
        />
        <div className="flex items-center justify-between">
          <p className={cn("font-mono text-xs", error ? "text-cyber-pink" : "text-foreground/30")}>
            {error || `${content.length}/1000`}
          </p>
          <button
            type="submit"
            disabled={addComment.isPending}
            className="clip-corner-sm flex items-center gap-2 bg-cyber-yellow px-5 py-2 font-mono text-sm font-bold text-cyber-dark transition-all hover:bg-cyber-cyan disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {addComment.isPending ? "传输中..." : "发送信号"}
          </button>
        </div>
      </form>
    </section>
  );
}

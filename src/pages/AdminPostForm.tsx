import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Markdown } from "@/components/Markdown";
import { ChevronLeft, Save, Eye, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["人物志", "风格研究", "夜城指南", "站务公告", "夜城杂谈"];

export default function AdminPostForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const me = trpc.blog.me.useQuery();
  const existing = trpc.blog.byId.useQuery(
    { id: Number(id) },
    { enabled: isEdit && me.data?.isAdmin === true, retry: false },
  );

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    cover: "",
    tags: "",
    category: "夜城杂谈",
    published: true,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (existing.data && !loaded) {
      const p = existing.data;
      setForm({
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        content: p.content,
        cover: p.cover,
        tags: p.tags,
        category: p.category,
        published: p.published,
      });
      setLoaded(true);
    }
  }, [existing.data, loaded]);

  useEffect(() => {
    if (me.data && !me.data.isAdmin) navigate("/admin/login", { replace: true });
  }, [me.data, navigate]);

  const create = trpc.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.listAdmin.invalidate();
      utils.blog.list.invalidate();
      navigate("/admin");
    },
    onError: (e) => setError(e.message),
  });
  const update = trpc.blog.update.useMutation({
    onSuccess: () => {
      utils.blog.listAdmin.invalidate();
      utils.blog.list.invalidate();
      navigate("/admin");
    },
    onError: (e) => setError(e.message),
  });

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const suggestSlug = () => {
    if (form.slug) return;
    set("slug", `signal-${Date.now().toString(36)}`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isEdit) {
      update.mutate({ id: Number(id), data: form });
    } else {
      create.mutate(form);
    }
  };

  if (!me.data?.isAdmin) {
    return (
      <div className="py-32 text-center font-mono text-cyber-cyan">
        正在验证权限<span className="type-cursor" />
      </div>
    );
  }

  const saving = create.isPending || update.isPending;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        to="/admin"
        className="mb-6 inline-flex items-center gap-1 font-mono text-xs text-foreground/45 hover:text-cyber-cyan"
      >
        <ChevronLeft className="h-4 w-4" /> 返回控制台
      </Link>

      <h1 className="mb-8 text-2xl font-black tracking-wider">
        <span className="neon-pink">{isEdit ? "编辑信号" : "新建信号"}</span>
        <span className="ml-3 font-mono text-xs text-foreground/35">
          // {isEdit ? `EDIT #${id}` : "NEW TRANSMISSION"}
        </span>
      </h1>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 左侧：正文 */}
        <div className="space-y-5">
          <Field label="标题">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              maxLength={255}
              placeholder="文章标题"
              className="w-full border border-cyber-line bg-cyber-panel/70 px-3 py-2.5 text-lg font-bold outline-none focus:border-cyber-yellow"
            />
          </Field>

          <Field label="摘要">
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="一两句话概括这篇文章（显示在列表卡片上）"
              className="w-full resize-y border border-cyber-line bg-cyber-panel/70 px-3 py-2 text-sm outline-none focus:border-cyber-yellow"
            />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-foreground/50">
                正文 <span className="text-cyber-cyan">支持 Markdown</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="flex items-center gap-1.5 border border-cyber-line px-3 py-1 font-mono text-xs text-foreground/60 transition-colors hover:border-cyber-cyan hover:text-cyber-cyan"
              >
                {showPreview ? <Code className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPreview ? "返回编辑" : "预览"}
              </button>
            </div>
            {showPreview ? (
              <div className="min-h-[420px] border border-cyber-cyan/40 bg-cyber-panel/40 p-5">
                <Markdown content={form.content || "*（暂无内容）*"} />
              </div>
            ) : (
              <textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                required
                rows={18}
                placeholder={"用 Markdown 写作：\n\n## 二级标题\n**加粗**  *强调*\n> 引用\n- 列表"}
                className="w-full resize-y border border-cyber-line bg-cyber-dark/80 px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-cyber-yellow"
              />
            )}
          </div>
        </div>

        {/* 右侧：元信息 */}
        <div className="space-y-5">
          <Field label="SLUG（URL 路径）" hint="小写字母、数字、连字符">
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              onBlur={suggestSlug}
              required
              pattern="[a-z0-9-]+"
              maxLength={255}
              placeholder="my-first-post"
              className="w-full border border-cyber-line bg-cyber-panel/70 px-3 py-2 font-mono text-sm outline-none focus:border-cyber-yellow"
            />
          </Field>

          <Field label="分类">
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              list="category-list"
              maxLength={100}
              className="w-full border border-cyber-line bg-cyber-panel/70 px-3 py-2 font-mono text-sm outline-none focus:border-cyber-yellow"
            />
            <datalist id="category-list">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="标签" hint="用逗号分隔，如：边缘行者,人物志">
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              maxLength={255}
              placeholder="边缘行者,人物志"
              className="w-full border border-cyber-line bg-cyber-panel/70 px-3 py-2 font-mono text-sm outline-none focus:border-cyber-yellow"
            />
          </Field>

          <Field label="封面图 URL" hint="可选，留空使用默认样式">
            <input
              value={form.cover}
              onChange={(e) => set("cover", e.target.value)}
              maxLength={500}
              placeholder="https://..."
              className="w-full border border-cyber-line bg-cyber-panel/70 px-3 py-2 font-mono text-sm outline-none focus:border-cyber-yellow"
            />
          </Field>

          <div className="flex items-center justify-between border border-cyber-line bg-cyber-panel/70 px-3 py-2.5">
            <span className="font-mono text-xs tracking-widest text-foreground/50">立即发布</span>
            <button
              type="button"
              onClick={() => set("published", !form.published)}
              className={cn(
                "relative h-6 w-11 transition-colors",
                form.published ? "bg-cyber-green" : "bg-cyber-line",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 bg-cyber-dark transition-all",
                  form.published ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </div>

          {error && (
            <p className="border border-cyber-pink/50 bg-cyber-pink/10 px-3 py-2 font-mono text-xs text-cyber-pink">
              &gt; ERROR: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="clip-corner flex w-full items-center justify-center gap-2 bg-cyber-yellow py-3 font-mono text-sm font-black tracking-widest text-cyber-dark transition-all hover:bg-cyber-cyan disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "写入中..." : isEdit ? "保存修改" : "发出信号"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs tracking-widest text-foreground/50">
        {label}
        {hint && <span className="ml-2 text-foreground/30">（{hint}）</span>}
      </span>
      {children}
    </label>
  );
}

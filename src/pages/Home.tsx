import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { GlitchText } from "@/components/cyber/GlitchText";
import { TypewriterText } from "@/components/cyber/TypewriterText";
import { PostCard } from "@/components/PostCard";
import { crewMembers } from "@/data/crew";
import { ChevronRight, Zap, ShieldAlert, CloudRain, MapPin, Users } from "lucide-react";

export default function Home() {
  const latest = trpc.blog.list.useQuery({ page: 1, pageSize: 6 });
  const featured = latest.data?.items[0];
  const rest = latest.data?.items.slice(1) ?? [];

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* 背景光晕 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 300px at 15% 20%, rgba(0,240,255,0.12), transparent), radial-gradient(700px 350px at 85% 70%, rgba(255,42,109,0.1), transparent), radial-gradient(500px 250px at 60% 10%, rgba(252,238,10,0.06), transparent)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 md:pb-24 md:pt-24">
          <p className="mb-5 font-mono text-xs tracking-widest text-cyber-cyan/80 md:text-sm">
            &gt; 正在建立安全连接......... <span className="text-cyber-green">OK</span>
            <span className="ml-3 text-foreground/40">ENCRYPT: AES-2077</span>
          </p>

          <h1 className="mb-4 text-5xl font-black leading-tight tracking-wide md:text-8xl">
            <GlitchText text="夜之城信号" className="neon-yellow neon-flicker" />
          </h1>
          <p className="mb-2 font-mono text-sm tracking-[0.35em] text-cyber-pink md:text-lg">
            NIGHT CITY SIGNAL // v2.0.7.7
          </p>

          <div className="mb-10 h-8 text-lg text-cyber-cyan md:text-xl">
            <TypewriterText
              lines={[
                "早上好，夜之城！",
                "无名小卒，还是名扬天下？",
                "High Tech, Low Life.",
                "这里记录边缘行者的传说。",
                "保持信号，别死。",
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/posts"
              className="clip-corner group flex items-center gap-2 bg-cyber-yellow px-8 py-3.5 font-mono text-base font-black tracking-widest text-cyber-dark transition-all hover:bg-cyber-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            >
              <Zap className="h-5 w-5" />
              接入信号
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/crew"
              className="clip-corner group flex items-center gap-2 border-2 border-cyber-pink bg-cyber-pink/10 px-8 py-3 font-mono text-base font-bold tracking-widest text-cyber-pink transition-all hover:bg-cyber-pink hover:text-cyber-dark"
            >
              <Users className="h-5 w-5" />
              认识边缘行者
            </Link>
          </div>

          {/* 状态面板 */}
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-cyber-line bg-cyber-line/60 md:grid-cols-4">
            {[
              { icon: Zap, label: "SIGNAL STATUS", value: "ONLINE", color: "#39ff14" },
              { icon: ShieldAlert, label: "威胁等级", value: "★★★★★", color: "#ff2a6d" },
              { icon: MapPin, label: "当前区域", value: "夜之城 · 沃森", color: "#00f0ff" },
              { icon: CloudRain, label: "今日天气", value: "酸雨 24°C", color: "#fcee0a" },
            ].map((s) => (
              <div key={s.label} className="bg-cyber-panel/90 p-4">
                <div className="mb-1 flex items-center gap-2 font-mono text-[10px] tracking-widest text-foreground/40">
                  <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                  {s.label}
                </div>
                <p className="font-mono text-lg font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="hazard h-2 w-full opacity-70" />
      </section>

      {/* ============ 头条 ============ */}
      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <SectionHead code="HEADLINE" title="头条信号" />
          <Link to={`/posts/${featured.slug}`} className="group block">
            <article className="cyber-card clip-corner border-flow relative overflow-hidden p-7 md:p-10">
              <span className="absolute -right-4 -top-6 select-none font-mono text-[120px] font-black leading-none text-cyber-line/40">
                01
              </span>
              <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="clip-tag bg-cyber-pink px-2.5 py-1 font-bold text-cyber-dark">
                  最新发布
                </span>
                <span className="clip-tag bg-cyber-yellow px-2.5 py-1 font-bold text-cyber-dark">
                  {featured.category}
                </span>
                <span className="text-foreground/40">
                  {new Date(featured.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <h2 className="mb-4 max-w-3xl text-2xl font-black leading-snug transition-colors group-hover:text-cyber-yellow md:text-4xl">
                {featured.title}
              </h2>
              <p className="max-w-3xl leading-7 text-foreground/60">{featured.summary}</p>
              <p className="mt-6 font-mono text-sm text-cyber-cyan">
                &gt; 读取完整数据
                <ChevronRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </article>
          </Link>
        </section>
      )}

      {/* ============ 边缘行者小队 ============ */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead code="EDGERUNNERS" title="边缘行者小队" />
        <p className="mb-8 max-w-2xl leading-7 text-foreground/55">
          曼恩的队伍——一群在夜之城边缘讨生活的佣兵。有人活着离开，有人成了传奇，
          所有人都成了我们忘不掉的故事。
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {crewMembers.map((m) => (
            <Link
              key={m.id}
              to={`/crew#${m.id}`}
              className="cyber-card group p-4 text-center"
              style={{ ["--member-color" as string]: m.color }}
            >
              <div
                className="mx-auto mb-3 grid h-16 w-16 place-items-center clip-corner text-2xl font-black text-cyber-dark transition-transform group-hover:scale-105"
                style={{ background: m.color, boxShadow: `0 0 24px ${m.color}44` }}
              >
                {m.initial}
              </div>
              <p className="font-bold transition-colors group-hover:text-cyber-yellow">
                {m.name}
              </p>
              <p className="font-mono text-[10px] tracking-wider text-foreground/40">
                {m.role}
              </p>
              <p
                className="mt-1 font-mono text-[10px]"
                style={{ color: m.status === "存活" ? "#39ff14" : "#ff2a6d" }}
              >
                ● {m.status}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 最新文章 ============ */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHead code="ARCHIVES" title="最新信号" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <PostCard key={post.id} post={post} index={i + 1} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/posts"
            className="clip-corner-sm inline-flex items-center gap-2 border border-cyber-cyan/60 px-6 py-2.5 font-mono text-sm tracking-widest text-cyber-cyan transition-all hover:bg-cyber-cyan hover:text-cyber-dark"
          >
            查看全部信号档案
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ code, title }: { code: string; title: string }) {
  return (
    <div className="mb-8 flex items-end gap-4">
      <h2 className="text-2xl font-black tracking-wider md:text-3xl">
        <GlitchText text={title} staticMode className="neon-cyan" />
      </h2>
      <span className="mb-1 font-mono text-xs tracking-[0.3em] text-foreground/35">
        // {code}
      </span>
      <span className="mb-2 hidden h-px flex-1 bg-gradient-to-r from-cyber-cyan/50 to-transparent md:block" />
    </div>
  );
}

import { crewMembers } from "@/data/crew";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Skull, HeartPulse, Quote } from "lucide-react";

export default function Crew() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* 页头 */}
      <header className="mb-6">
        <p className="mb-2 font-mono text-xs tracking-[0.3em] text-cyber-pink/80">
          &gt; LOADING CREW DATABASE...
        </p>
        <h1 className="text-4xl font-black tracking-wider md:text-5xl">
          <GlitchText text="边缘行者" className="neon-pink" />
        </h1>
        <p className="mt-2 font-mono text-sm text-foreground/45">// EDGERUNNERS — 2022</p>
      </header>

      <p className="mb-12 max-w-3xl leading-8 text-foreground/60">
        「边缘行者」——在夜之城，这个词指的是游离于法律与公司体系之外的佣兵。
        2022 年的这部动画只有十集，却讲完了大卫·马丁内斯和他队友们的一生。
        以下档案按<strong className="text-cyber-cyan">出场小队</strong>整理，
        <em className="text-cyber-pink">含剧透</em>，没看过的佣兵请自行斟酌。
      </p>

      {/* 角色卡片 */}
      <div className="grid gap-6 md:grid-cols-2">
        {crewMembers.map((m, idx) => (
          <article
            key={m.id}
            id={m.id}
            className="cyber-card clip-corner relative scroll-mt-24 p-6"
            style={{ borderColor: `${m.color}33` }}
          >
            {/* 序号 */}
            <span className="absolute right-4 top-3 select-none font-mono text-5xl font-black text-cyber-line/50">
              {String(idx + 1).padStart(2, "0")}
            </span>

            <div className="mb-4 flex items-start gap-4">
              {/* 头像块 */}
              <div
                className="grid h-20 w-20 shrink-0 place-items-center clip-corner text-3xl font-black text-cyber-dark"
                style={{
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}99)`,
                  boxShadow: `0 0 30px ${m.color}55`,
                }}
              >
                {m.initial}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black" style={{ color: m.color }}>
                  {m.name}
                </h2>
                <p className="font-mono text-[10px] tracking-widest text-foreground/40">
                  {m.nameEn}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span className="clip-tag border border-cyber-line px-2 py-0.5 text-foreground/60">
                    {m.role}
                  </span>
                  <span
                    className="clip-tag flex items-center gap-1 px-2 py-0.5 font-bold"
                    style={{
                      background: m.status === "存活" ? "#39ff1422" : "#ff2a6d22",
                      color: m.status === "存活" ? "#39ff14" : "#ff2a6d",
                    }}
                  >
                    {m.status === "存活" ? (
                      <HeartPulse className="h-3 w-3" />
                    ) : (
                      <Skull className="h-3 w-3" />
                    )}
                    {m.status}
                  </span>
                </div>
              </div>
            </div>

            {/* 专长 */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {m.specialty.map((s) => (
                <span
                  key={s}
                  className="border px-2 py-0.5 font-mono text-[11px]"
                  style={{ borderColor: `${m.color}55`, color: m.color }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* 台词 */}
            <blockquote
              className="mb-4 flex gap-2 border-l-2 py-1 pl-3 text-sm italic"
              style={{ borderColor: m.color, color: `${m.color}dd` }}
            >
              <Quote className="h-4 w-4 shrink-0 opacity-60" />
              {m.quote}
            </blockquote>

            <p className="text-sm leading-7 text-foreground/65">{m.description}</p>
          </article>
        ))}
      </div>

      {/* 结语 */}
      <div className="mt-14 border border-cyber-line bg-cyber-panel/50 p-8 text-center">
        <p className="mb-2 font-mono text-xs tracking-[0.3em] text-cyber-cyan/60">
          AFTERLIFE // 来生酒吧
        </p>
        <p className="text-lg leading-8 text-foreground/75">
          来生酒吧的酒单上，每一杯酒都是一个死去的传奇。
          <br />
          <span className="neon-yellow font-bold">「大卫·马丁内斯」</span>
          ——伏特加加小可可乐，敬那个温柔的笨蛋。
        </p>
      </div>
    </div>
  );
}

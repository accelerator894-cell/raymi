import { GlitchText } from "@/components/cyber/GlitchText";
import { Cpu, Database, Globe, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <p className="mb-2 font-mono text-xs tracking-[0.3em] text-cyber-cyan/70">
          &gt; QUERY: ABOUT_THIS_SITE
        </p>
        <h1 className="text-4xl font-black tracking-wider md:text-5xl">
          <GlitchText text="关于本站" className="neon-cyan" />
        </h1>
      </header>

      <div className="md-body">
        <h2>这是什么</h2>
        <p>
          「夜之城信号」是一个赛博朋克 2077 与《赛博朋克：边缘行者》的<strong>粉丝同人博客</strong>。
          这里写人物志、聊美学、记录这座虚构城市带给我们的真实感动。
        </p>

        <h2>为什么叫「信号」</h2>
        <p>
          在夜之城，每个人都在发送信号：佣兵接活靠信号，网络行者深潜靠信号，
          丽贝卡的枪声是信号，露西的月球也是信号。这个博客，是发给你的一条。
        </p>

        <h2>版权声明</h2>
        <p>
          本站为非营利粉丝作品，与 CD PROJEKT RED、TRIGGER 无任何隶属关系。
          《赛博朋克 2077》及其相关设定版权归 CD PROJEKT RED 所有；
          《赛博朋克：边缘行者》版权归 CD PROJEKT RED 与 TRIGGER 所有。
          站内视觉均为原创设计，仅致敬美术风格，未使用官方素材。
        </p>
      </div>

      {/* 技术架构 */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-black tracking-wider">
          <span className="neon-yellow">技术架构</span>
          <span className="ml-3 font-mono text-xs text-foreground/35">// TECH STACK</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Cpu,
              title: "前端",
              desc: "React 19 + TypeScript + Tailwind CSS，全站故障特效 / 扫描线 / 霓虹美学",
              color: "#00f0ff",
            },
            {
              icon: Database,
              title: "后端",
              desc: "Hono + tRPC + Drizzle ORM + MySQL，文章与评论全类型安全接口",
              color: "#fcee0a",
            },
            {
              icon: Globe,
              title: "部署",
              desc: "Docker 一键部署，支持任意云服务器 + 自有域名 + HTTPS",
              color: "#ff2a6d",
            },
            {
              icon: ShieldCheck,
              title: "后台",
              desc: "管理员账号密码登录，在线发文 / 编辑 / 删除 / 评论管理",
              color: "#39ff14",
            },
          ].map((item) => (
            <div key={item.title} className="cyber-card p-5">
              <item.icon className="mb-3 h-6 w-6" style={{ color: item.color }} />
              <p className="mb-1 font-bold" style={{ color: item.color }}>
                {item.title}
              </p>
              <p className="text-sm leading-6 text-foreground/55">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 border border-dashed border-cyber-line p-6 text-center font-mono text-sm text-foreground/50">
        <p className="neon-cyan mb-2 text-base">&gt; 保持信号，别死。&lt;</p>
        <p>STAY CONNECTED. STAY ALIVE.</p>
      </div>
    </div>
  );
}

import { Link, NavLink, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Menu, X, Terminal, Radio } from "lucide-react";
import { Overlays } from "@/components/cyber/Overlays";
import { GlitchText } from "@/components/cyber/GlitchText";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "首页", code: "01" },
  { to: "/posts", label: "信号档案", code: "02" },
  { to: "/crew", label: "边缘行者", code: "03" },
  { to: "/about", label: "关于本站", code: "04" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("zh-CN", { hour12: false }) +
          " // NC TIME",
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid-bg relative">
      <Overlays />

      {/* 顶部导航 */}
      <header className="fixed top-0 inset-x-0 z-[80] border-b border-cyber-line/80 bg-cyber-dark/85 backdrop-blur-md">
        <div className="hazard-thin h-[3px] w-full opacity-70" />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center bg-cyber-yellow text-cyber-dark clip-corner-sm">
              <Radio className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-black tracking-widest text-foreground group-hover:text-cyber-yellow transition-colors">
                <GlitchText text="夜之城信号" staticMode />
              </span>
              <span className="block font-mono text-[10px] tracking-[0.3em] text-cyber-cyan/70">
                NIGHT CITY SIGNAL
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative px-4 py-2 font-mono text-sm tracking-wider transition-colors",
                    isActive
                      ? "text-cyber-yellow"
                      : "text-foreground/60 hover:text-cyber-cyan",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="mr-1 text-[10px] opacity-50">
                      {item.code}/
                    </span>
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-0 h-[2px] bg-cyber-yellow transition-all",
                        isActive
                          ? "opacity-100 shadow-[0_0_8px_#fcee0a]"
                          : "opacity-0 group-hover:opacity-40",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <Link
              to="/admin"
              className="ml-3 clip-corner-sm border border-cyber-pink/50 px-3 py-1.5 font-mono text-xs tracking-widest text-cyber-pink transition-all hover:bg-cyber-pink hover:text-cyber-dark"
            >
              <Terminal className="mr-1 inline h-3.5 w-3.5" />
              管理接入
            </Link>
          </nav>

          <button
            className="text-foreground md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="菜单"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 移动端菜单 */}
        {menuOpen && (
          <nav className="border-t border-cyber-line bg-cyber-dark/95 px-4 py-3 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "block border-l-2 px-3 py-2.5 font-mono text-sm",
                    isActive
                      ? "border-cyber-yellow text-cyber-yellow"
                      : "border-transparent text-foreground/70",
                  )
                }
              >
                <span className="mr-2 text-[10px] opacity-50">{item.code}/</span>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              className="block border-l-2 border-transparent px-3 py-2.5 font-mono text-sm text-cyber-pink"
            >
              <span className="mr-2 text-[10px] opacity-50">99/</span>管理接入
            </NavLink>
          </nav>
        )}
      </header>

      {/* 主内容 */}
      <main className="relative z-10 pt-16">
        <div className="page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 mt-24 border-t border-cyber-line bg-cyber-panel/60">
        <div className="hazard h-[6px] w-full opacity-80" />
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-lg font-black tracking-widest">
                <GlitchText text="夜之城信号" staticMode className="neon-yellow" />
              </p>
              <p className="mt-1 font-mono text-xs text-foreground/50">
                SIGNAL FROM NIGHT CITY — 无名小卒，还是名扬天下？
              </p>
            </div>
            <div className="font-mono text-xs leading-6 text-foreground/45">
              <p className="text-cyber-cyan/70">{time}</p>
              <p>粉丝同人作品 · 与官方无关</p>
              <p>
                《赛博朋克2077》© CD PROJEKT RED · 《边缘行者》© CD PROJEKT RED /
                TRIGGER
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

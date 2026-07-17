import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Lock, User, LogIn } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = trpc.blog.login.useMutation({
    onSuccess: async () => {
      await utils.blog.me.invalidate();
      navigate("/admin");
    },
    onError: (err) => setError(err.message),
  });

  const me = trpc.blog.me.useQuery();
  if (me.data?.isAdmin) {
    navigate("/admin", { replace: true });
    return null;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login.mutate({ username, password });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-24">
      <div className="cyber-card clip-corner border-flow p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-cyber-pink/70">
            RESTRICTED AREA
          </p>
          <h1 className="text-2xl font-black tracking-widest">
            <GlitchText text="管理员接入" staticMode className="neon-pink" />
          </h1>
          <p className="mt-2 font-mono text-xs text-foreground/40">
            // 需要 LEVEL-5 权限验证
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="管理员账号"
              autoComplete="username"
              className="w-full border border-cyber-line bg-cyber-dark/80 py-2.5 pl-10 pr-3 font-mono text-sm outline-none transition-colors placeholder:text-foreground/30 focus:border-cyber-pink"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="访问密钥"
              autoComplete="current-password"
              className="w-full border border-cyber-line bg-cyber-dark/80 py-2.5 pl-10 pr-3 font-mono text-sm outline-none transition-colors placeholder:text-foreground/30 focus:border-cyber-pink"
            />
          </div>

          {error && (
            <p className="border border-cyber-pink/50 bg-cyber-pink/10 px-3 py-2 font-mono text-xs text-cyber-pink">
              &gt; ACCESS DENIED: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="clip-corner flex w-full items-center justify-center gap-2 bg-cyber-pink py-3 font-mono text-sm font-black tracking-widest text-cyber-dark transition-all hover:bg-cyber-yellow disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {login.isPending ? "验证中..." : "接入系统"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] leading-5 text-foreground/30">
        默认账号 admin / admin123
        <br />
        请在部署后通过环境变量 ADMIN_USERNAME / ADMIN_PASSWORD 修改
      </p>
    </div>
  );
}

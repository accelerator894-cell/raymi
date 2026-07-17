import { Link } from "react-router";
import { GlitchText } from "@/components/cyber/GlitchText";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <p className="mb-6 text-8xl font-black">
        <GlitchText text="404" className="neon-pink" />
      </p>
      <p className="mb-2 font-mono text-sm tracking-[0.3em] text-cyber-cyan/70">
        SIGNAL LOST
      </p>
      <p className="mb-10 text-foreground/55">
        你访问的频段不存在——可能已被荒坂抹除，或从未存在过。
      </p>
      <Link
        to="/"
        className="clip-corner-sm inline-flex items-center gap-2 border border-cyber-yellow px-6 py-2.5 font-mono text-sm text-cyber-yellow transition-all hover:bg-cyber-yellow hover:text-cyber-dark"
      >
        <ChevronLeft className="h-4 w-4" /> 返回主频段
      </Link>
    </div>
  );
}

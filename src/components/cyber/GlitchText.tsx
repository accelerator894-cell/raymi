import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  /** 静止模式：只保留重影，不播放故障动画 */
  staticMode?: boolean;
}

export function GlitchText({ text, className, staticMode }: GlitchTextProps) {
  return (
    <span
      className={cn("glitch", staticMode && "glitch-static", className)}
      data-text={text}
    >
      {text}
    </span>
  );
}

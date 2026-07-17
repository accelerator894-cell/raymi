import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  lines: string[];
  className?: string;
  typingSpeed?: number;
  pause?: number;
}

export function TypewriterText({
  lines,
  className,
  typingSpeed = 65,
  pause = 2200,
}: TypewriterTextProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIndex % lines.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && length < current.length) {
      timer = setTimeout(() => setLength((v) => v + 1), typingSpeed);
    } else if (!deleting && length === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && length > 0) {
      timer = setTimeout(() => setLength((v) => v - 1), typingSpeed / 2.5);
    } else {
      timer = setTimeout(() => {
        setDeleting(false);
        setLineIndex((v) => (v + 1) % lines.length);
      }, 350);
    }
    return () => clearTimeout(timer);
  }, [length, deleting, lineIndex, lines, typingSpeed, pause]);

  const text = lines[lineIndex % lines.length].slice(0, length);

  return (
    <span className={cn("type-cursor font-mono", className)}>
      {text}
      {text.length === 0 && " "}
    </span>
  );
}

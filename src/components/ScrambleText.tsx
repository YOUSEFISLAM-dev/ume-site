import { useEffect, useState } from "react";

const alphabet = "0123456789ABCDEF<>/[]{}";

type ScrambleTextProps = {
  text: string;
  reducedMotion: boolean;
};

export function ScrambleText({ text, reducedMotion }: ScrambleTextProps) {
  const [display, setDisplay] = useState(reducedMotion ? text : "");

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const totalFrames = 16;
    const timer = window.setInterval(() => {
      frame += 1;
      const resolved = Math.floor((frame / totalFrames) * text.length);
      const next = Array.from(text, (character, index) => {
        if (character === " " || index < resolved) return character;
        return alphabet[(frame * 7 + index * 11) % alphabet.length];
      }).join("");
      setDisplay(next);
      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 38);

    return () => window.clearInterval(timer);
  }, [reducedMotion, text]);

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{display || "　"}</span>
    </span>
  );
}

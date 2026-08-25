"use client";

export default function AmbientBackground() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
  }));

  const hearts = ["💜", "✨", "💫", "🤍", "⭐"];
  const floaters = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 6,
    emoji: hearts[i % hearts.length],
    size: 14 + Math.random() * 14,
  }));

  return (
    <div className="ambient-bg" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={`star-${s.id}`}
          className="ambient-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {floaters.map((f) => (
        <span
          key={`float-${f.id}`}
          className="ambient-float"
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            fontSize: f.size,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

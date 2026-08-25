"use client";
import { useEffect, useState } from "react";

export default function VideoStage({ videoRef, src, active, onEnded }) {
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.currentTime = 0;
    const playPromise = el.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => setNeedsTap(true));
    }
  }, [active, videoRef]);

  function handleTap() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play().then(() => setNeedsTap(false));
  }

  return (
    <section className={`stage video-stage ${active ? "stage-active" : "stage-hidden"}`}>
      <div className="video-frame">
        <video ref={videoRef} src={src} playsInline onEnded={onEnded} className="video-el" />
        {active && needsTap && (
          <button className="video-tap-overlay" onClick={handleTap}>
            ▶ Tap to play
          </button>
        )}
      </div>
    </section>
  );
}

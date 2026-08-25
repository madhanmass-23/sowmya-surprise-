"use client";
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AmbientBackground from "@/components/AmbientBackground";
import PasswordGate from "@/components/PasswordGate";
import Countdown from "@/components/Countdown";
import VideoStage from "@/components/VideoStage";
import StoryPage from "@/components/StoryPage";
import MemoryPage from "@/components/MemoryPage";
import CandleScene from "@/components/CandleScene";
import FinalCelebration from "@/components/FinalCelebration";
import { config } from "@/data/config";
import { journey } from "@/data/journey";

export default function Home() {
  const [stage, setStage] = useState("password"); // password -> countdown -> journey
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [musicStatus, setMusicStatus] = useState("Loading");
  const videoRef = useRef(null);
  const bgMusicRef = useRef(null);
  const prevIsVideoStage = useRef(false);

  function handleUnlock() {
    console.log("[MUSIC] Unlock clicked");
    // Prime the <video> element for autoplay-with-sound
    const el = videoRef.current;
    if (el) {
      el.muted = true;
      el.play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
        })
        .catch(() => {});
    }

    if (bgMusicRef.current) {
      console.log("[MUSIC] Audio source:", bgMusicRef.current.src);
      console.log("[MUSIC] Attempting playback");
      bgMusicRef.current.play().then(() => {
        console.log("[MUSIC] Playback started");
        setMusicStatus("Playing");
      }).catch(err => {
        console.error("[MUSIC] Playback failed:", err);
        setMusicStatus("Error: " + err.message);
      });
    }

    setStage("countdown");
  }

  function nextJourneyStep() {
    if (journeyIndex < journey.length - 1) {
      setJourneyIndex(i => i + 1);
    }
  }

  function resetJourney() {
    setJourneyIndex(0);
    setStage("countdown");
  }

  // Pre-load next images for smooth transitions
  useEffect(() => {
    if (stage === "journey" && journey[journeyIndex + 1]?.type === "memory") {
      const img = new Image();
      img.src = journey[journeyIndex + 1].content.image;
    }
  }, [journeyIndex, stage]);

  const renderJourneyStage = () => {
    const current = journey[journeyIndex];
    if (!current) return null;

    return (
      <AnimatePresence mode="wait" key={`journey-${current.id}`}>
        {current.type === "story" && (
          <StoryPage
            key={current.id}
            content={current.content}
            animation={current.animation}
            category={current.category}
            onNext={nextJourneyStep}
          />
        )}
        
        {current.type === "memory" && (
          <MemoryPage
            key={current.id}
            content={current.content}
            animation={current.animation}
            category={current.category}
            onNext={nextJourneyStep}
          />
        )}

        {current.type === "candle" && (
          <CandleScene
            key={current.id}
            onComplete={nextJourneyStep}
          />
        )}

        {current.type === "celebration" && (
          <FinalCelebration
            key={current.id}
            onNext={nextJourneyStep}
          />
        )}

        {current.type === "ending" && (
          <motion.section 
            className="stage ending-stage"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          >
            <p className="ending-text">{current.content.text}</p>
            <p className="ending-subtext">{current.content.subText}</p>
            <button className="story-button replay-button" onClick={resetJourney}>
              {current.content.buttonText}
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    );
  };

  const currentJourneyPage = journey[journeyIndex];
  const isVideoStage = stage === "journey" && currentJourneyPage?.type === "video";

  // Initialize background music and click sound
  useEffect(() => {
    const audio = new Audio('/music/music.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    bgMusicRef.current = audio;
    setMusicStatus("Ready");

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    
    try {
      audioCtx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }

    const playClick = () => {
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      try {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        // ignore
      }
    };

    const handleClick = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        playClick();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      audio.pause();
      document.removeEventListener('click', handleClick);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, []);

  // Manage background music pausing/resuming during video
  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (isVideoStage && !prevIsVideoStage.current) {
      console.log("[MUSIC] Paused for video");
      bgMusicRef.current.pause();
      setMusicStatus("Paused");
    } else if (!isVideoStage && prevIsVideoStage.current) {
      console.log("[MUSIC] Resuming after video");
      bgMusicRef.current.play().then(() => {
        console.log("[MUSIC] Playback resumed");
        setMusicStatus("Playing");
      }).catch(err => {
        console.error("[MUSIC] Resume failed:", err);
        setMusicStatus("Error: " + err.message);
      });
    }
    prevIsVideoStage.current = isVideoStage;
  }, [isVideoStage]);

  return (
    <main className="app-shell">
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999, fontSize: '10px', color: '#0f0', background: '#000', padding: '4px', borderRadius: '4px' }}>
        Music: {musicStatus}
      </div>
      <AmbientBackground />

      {stage === "journey" && journeyIndex >= 0 && (
        <div className="progress-indicator">
          {journeyIndex + 1} / {journey.length}
        </div>
      )}

      {/* Video is always mounted to maintain autoplay capabilities */}
      <VideoStage
        videoRef={videoRef}
        src={config.videoSrc}
        active={isVideoStage}
        onEnded={nextJourneyStep}
      />

      {stage === "password" && (
        <PasswordGate password={config.password} onUnlock={handleUnlock} />
      )}

      {stage === "countdown" && (
        <Countdown from={config.countdownFrom} onComplete={() => setStage("journey")} />
      )}

      {stage === "journey" && !isVideoStage && renderJourneyStage()}
    </main>
  );
}

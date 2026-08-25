"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CandleScene({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: init text, 1: make a wish, 2: candle, 3: blown out
  const [micStatus, setMicStatus] = useState("idle"); // idle, listening, denied
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Sequence text
    const t1 = setTimeout(() => setStage(1), 3000);
    const t2 = setTimeout(() => {
      setStage(2);
      requestMic();
    }, 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cleanupMic();
    };
  }, []);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicStatus("listening");
      detectBlowing();
    } catch (err) {
      console.warn("Microphone access denied or unavailable", err);
      setMicStatus("denied");
    }
  };

  const detectBlowing = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume in low frequencies (typical for blowing wind noise)
    let sum = 0;
    for (let i = 0; i < 30; i++) {
      sum += dataArray[i];
    }
    const average = sum / 30;

    if (average > 180) { // Threshold for blowing
      handleBlowOut();
    } else {
      rafRef.current = requestAnimationFrame(detectBlowing);
    }
  };

  const handleBlowOut = () => {
    cleanupMic();
    setStage(3);
    setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds of darkness before celebration
  };

  const cleanupMic = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
  };

  return (
    <section className="stage candle-stage">
      <div className={`candle-scene-container ${stage === 3 ? "darkened" : ""}`}>
        
        {stage === 0 && (
          <motion.p 
            className="candle-text"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            Before you continue...
          </motion.p>
        )}
        
        {stage === 1 && (
          <motion.p 
            className="candle-text"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            Close your eyes. Make a wish.
          </motion.p>
        )}
        
        {stage >= 2 && (
          <div className="cake-container">
            {stage === 2 && (
              <motion.p 
                className="candle-text small-text"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              >
                Now blow out the candles.
              </motion.p>
            )}
            
            <motion.div 
              className="cake"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="candle">
                {stage === 2 && <div className="flame"></div>}
                {stage === 3 && <div className="smoke"></div>}
              </div>
            </motion.div>

            {stage === 2 && micStatus === "denied" && (
              <motion.button
                className="fallback-blow-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                onClick={handleBlowOut}
              >
                Tap to blow the candles ✨
              </motion.button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

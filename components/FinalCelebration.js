"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FinalCelebration({ onNext }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="stage celebration-stage">
      <div className="confetti-container">
        {/* Simple CSS-based confetti or particles will be handled in globals.css */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className={`confetti piece-${i % 5}`} style={{ 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}></div>
        ))}
      </div>

      <motion.div
        className="celebration-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
      >
        <h1 className="celebration-title">HAPPY BIRTHDAY</h1>
        <h2 className="celebration-name">Sowmya ✨</h2>
      </motion.div>

      {showButton && (
        <motion.button
          className="story-button celebration-button"
          onClick={onNext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          One last thing...
        </motion.button>
      )}
    </section>
  );
}

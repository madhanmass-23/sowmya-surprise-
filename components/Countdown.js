"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Countdown({ from = 5, onComplete }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (count <= 0) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onComplete]);

  return (
    <section className="stage countdown-stage">
      <p className="countdown-label">get ready...</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          className="countdown-number"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.45 }}
        >
          {count > 0 ? count : "💜"}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

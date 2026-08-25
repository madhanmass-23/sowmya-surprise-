"use client";
import { motion } from "framer-motion";

export default function MemoryPage({ content, animation, category, onNext }) {
  return (
    <section className={`stage memory-stage category-${category}`}>
      <motion.div
        className={`memory-card ${animation === 'polaroid' ? 'polaroid-style' : ''}`}
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="memory-image-container">
          <img src={content.image} alt="Memory" className="memory-image" />
        </div>
        {content.caption && (
          <div className="memory-caption-container">
            <p className="memory-caption">{content.caption}</p>
          </div>
        )}
      </motion.div>

      <motion.button
        className="story-button memory-button"
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {content.buttonText}
      </motion.button>
    </section>
  );
}

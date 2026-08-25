"use client";
import { motion } from "framer-motion";

export default function StoryPage({ content, animation, category, onNext }) {
  // Select animation variants based on the 'animation' prop
  const getVariants = () => {
    switch (animation) {
      case "blur-reveal":
        return {
          initial: { opacity: 0, filter: "blur(10px)", y: 20 },
          animate: { opacity: 1, filter: "blur(0px)", y: 0 },
          transition: { duration: 1.2, ease: "easeOut" }
        };
      case "gentle-up":
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: "easeOut" }
        };
      case "bounce":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: "spring", bounce: 0.5, duration: 0.8 }
        };
      case "letter-reveal":
      case "scale-in":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.8 }
        };
      case "slow-fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 2 }
        };
      default: // 'fade' or 'stars'
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 1 }
        };
    }
  };

  const vars = getVariants();

  return (
    <section className={`stage story-stage category-${category}`}>
      <motion.div
        className="story-content"
        initial={vars.initial}
        animate={vars.animate}
        transition={vars.transition}
      >
        <h2 className="story-text">{content.text}</h2>
        {content.subText && (
          <motion.p
            className="story-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {content.subText}
          </motion.p>
        )}
        
        <motion.button
          className="story-button"
          onClick={onNext}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content.buttonText}
        </motion.button>
      </motion.div>
    </section>
  );
}

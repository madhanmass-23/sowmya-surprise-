"use client";
import { motion } from "framer-motion";

export default function WishReveal({ title, message, signoff, photos }) {
  return (
    <section className="stage wish-stage">
      <motion.div
        className="wish-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1
          className="wish-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {title}
        </motion.h1>

        <motion.div
          className="wish-photos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {photos.map((p, i) => (
            <motion.div
              className="wish-photo"
              key={p.src}
              initial={{ opacity: 0, y: 16, rotate: i % 2 === 0 ? -4 : 4 }}
              animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -3 : 3 }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
            >
              <img src={p.src} alt={p.alt} />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="wish-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {message}
        </motion.p>

        <motion.p
          className="wish-signoff"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {signoff}
        </motion.p>
      </motion.div>
    </section>
  );
}

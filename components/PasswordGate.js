"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PasswordGate({ password, onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim() === password) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <section className="stage password-stage">
      <motion.div
        className={`password-card ${shake ? "shake" : ""}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="password-eyebrow">A little something for you</p>
        <h1 className="password-title">This is just for you 💜</h1>
        <p className="password-sub">Enter the code to unlock your surprise</p>

        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter code"
            autoFocus
            className="password-input"
          />
          <button type="submit" className="password-button">
            Unlock ✨
          </button>
        </form>

        {error && <p className="password-error">That's not quite it — try again</p>}
      </motion.div>
    </section>
  );
}

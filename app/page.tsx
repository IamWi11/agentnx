"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import VapiCallButton from "./components/VapiCallButton";
import { useLanguage } from "./context/LanguageContext";
import dynamic from "next/dynamic";

const TurnstileWidget = dynamic(() => import("./components/TurnstileWidget"), { ssr: false });

const AGENTNX_ASSISTANT_ID = "b14094a0-22a6-46e2-8aa0-b00435d85dd0";

// Fixed particle positions to avoid hydration mismatch
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: ((i * 47 + 11) % 88) + 6,
  y: ((i * 31 + 7) % 75) + 8,
  size: (i % 3) === 0 ? 2.5 : (i % 3) === 1 ? 1.5 : 2,
  duration: 5 + (i % 6),
  delay: (i * 0.35) % 4,
  opacity: (i % 4) === 0 ? 0.55 : 0.25,
}));

// Typewriter component
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const startTimer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 38);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  return (
    <>
      {displayed}
      {!done && <span className="animate-pulse opacity-50">|</span>}
    </>
  );
}

// Count-up hook
function useCountUp(target: number | string, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || typeof target === "string") return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function StatCard({ stat, label }: { stat: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isNumeric = /^\d+/.test(stat);
  const numericPart = isNumeric ? parseInt(stat.replace(/\D/g, "")) : 0;
  const prefix = stat.match(/^[^0-9]*/)?.[0] || "";
  const suffix = stat.match(/[^0-9]*$/)?.[0] || "";
  const count = useCountUp(isNumeric ? numericPart : 0, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 cursor-default transition-colors"
    >
      <div className="text-3xl font-extrabold text-blue-400 mb-1">
        {isNumeric ? `${prefix}${count}${suffix}` : stat}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const { t, lang, setLang } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/request-demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, turnstileToken }),
    });
    setSubmitted(true);
    setEmail("");
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-8 py-5 border-b border-white/10"
      >
        <span className="text-xl font-bold tracking-tight">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </span>
        <div className="flex items-center gap-4">
          <a href="/voice" className="text-gray-400 hover:text-white text-sm transition">{t.nav.voiceAgents}</a>
          <a href="/deviation" className="text-gray-400 hover:text-white text-sm transition">{t.nav.tryDemo}</a>
          <a href="/pricing" className="text-gray-400 hover:text-white text-sm transition">{t.nav.pricing}</a>

          {/* Language toggle */}
          <motion.button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs font-bold border border-white/20 hover:border-blue-400 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1"
          >
            <span className="text-base">{lang === "en" ? "🇪🇸" : "🇺🇸"}</span>
            {lang === "en" ? "ES" : "EN"}
          </motion.button>

          <motion.a
            href="#book-demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
          >
            {t.nav.bookDemo}
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-28 pb-20">
        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3], x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], x: [0, -40, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-400 pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: [0, -20, 0], opacity: [p.opacity, p.opacity * 2.2, p.opacity] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 relative z-10"
        >
          {t.hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl mb-6 relative z-10"
        >
          {t.hero.h1a}{" "}
          <span className="text-blue-400">
            <TypewriterText text={t.hero.h1b} delay={0.9} />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-400 max-w-2xl mb-10 relative z-10"
        >
          {t.hero.p}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10"
        >
          <motion.a
            href="#book-demo"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition"
          >
            {t.hero.cta1}
          </motion.a>
          <motion.a
            href="/deviation"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="border border-white/20 hover:border-blue-400 text-white font-semibold px-8 py-3.5 rounded-full text-base transition"
          >
            {t.hero.cta2}
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-2 relative z-10"
        >
          <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">{t.hero.voiceLabel}</div>
          <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label={t.hero.voiceBtn} size="md" />
        </motion.div>
      </section>

      {/* Industry Tabs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-5xl mx-auto px-6 py-16"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-4">{t.industry.heading}</motion.h2>
        <motion.p variants={fadeUp} className="text-gray-400 text-center mb-10 max-w-xl mx-auto">
          {t.industry.sub}
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-10">
          {t.industry.items.map((ind, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndustry(i)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                activeIndustry === i
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-white/20 text-gray-400 hover:border-blue-400 hover:text-white"
              }`}
            >
              {ind.icon} {ind.label}
            </motion.button>
          ))}
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center overflow-hidden relative min-h-[200px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeIndustry}-${lang}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">{t.industry.items[activeIndustry].icon}</div>
              <h3 className="text-2xl font-bold mb-3">{t.industry.items[activeIndustry].headline}</h3>
              <p className="text-gray-400 max-w-xl mx-auto mb-6">{t.industry.items[activeIndustry].desc}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {t.industry.items[activeIndustry].tags.map((tag) => (
                  <span key={tag} className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* How it works */}
      <section className="bg-white/5 border-y border-white/10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-4"
          >
            {t.howItWorks.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-xl mx-auto"
          >
            {t.howItWorks.sub}
          </motion.p>
          <div className="relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              style={{ originX: 0 }}
              className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-blue-500/40"
            />
            <div className="grid md:grid-cols-5 gap-6 relative">
              {t.howItWorks.steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.06, y: -6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center cursor-default"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.4 } }}
                    className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 flex items-center justify-center text-2xl mb-4 relative z-10 transition-colors"
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">
                    {t.howItWorks.stepLabel} {item.step}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-5xl mx-auto px-6 py-16"
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-12">
          {t.valueProps.heading}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {t.valueProps.items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -3 }}
              className="bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-colors cursor-default"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-red-400 text-lg mt-0.5">✗</span>
                <p className="text-gray-400 text-sm">{item.before}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg mt-0.5">✓</span>
                <p className="text-white text-sm font-medium">{item.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats */}
      <section className="bg-white/5 border-y border-white/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12"
          >
            {t.stats.heading}
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6">
            {t.stats.items.map((item) => (
              <StatCard key={item.label} stat={item.stat} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Voice Agents CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-10 text-center">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {t.voiceCta.badge}
          </div>
          <h2 className="text-3xl font-bold mb-3">
            {t.voiceCta.heading} <span className="text-blue-400">{t.voiceCta.headingBlue}</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm">{t.voiceCta.p}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/voice"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-full text-sm transition"
            >
              {t.voiceCta.btn1}
            </motion.a>
            <VapiCallButton assistantId={AGENTNX_ASSISTANT_ID} label={t.voiceCta.btn2} size="md" />
          </div>
        </div>
      </motion.section>

      {/* Book a Demo */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        id="book-demo"
        className="flex flex-col items-center text-center px-6 py-24"
      >
        <h2 className="text-3xl font-bold mb-3">{t.bookDemo.heading}</h2>
        <p className="text-gray-400 mb-8 max-w-md">{t.bookDemo.sub}</p>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-2xl font-semibold"
          >
            {t.bookDemo.thanks}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md">
            <input
              type="email"
              required
              placeholder={t.bookDemo.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
            <div className="flex justify-center">
              <TurnstileWidget
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>
            <motion.button
              type="submit"
              disabled={!turnstileToken}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-full text-sm transition"
            >
              {t.bookDemo.btn}
            </motion.button>
            <p className="text-gray-600 text-xs">{t.bookDemo.note}</p>
          </form>
        )}
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-gray-600 text-sm">
        © 2026 AgentNX.ai — {t.footer}
        <span className="mx-3">·</span>
        <span>A product of IMAGE 101 LLC</span>
        <span className="mx-3">·</span>
        <span>Service-Disabled Veteran-Owned Small Business</span>
      </footer>
    </main>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

export default function PricingPage() {
  const { t, lang, setLang } = useLanguage();
  const p = t.pricing;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-20">

      {/* Language toggle */}
      <div className="flex justify-end max-w-4xl mx-auto mb-6">
        <motion.button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs font-bold border border-white/20 hover:border-blue-400 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1"
        >
          <span className="text-base">{lang === "en" ? "🇪🇸" : "🇺🇸"}</span>
          {lang === "en" ? "ES" : "EN"}
        </motion.button>
      </div>

      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3"
        >
          {p.badge}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          {p.heading}<br />{p.headingLine2}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          {p.sub}
        </motion.p>
      </div>

      {/* Two cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">

        {/* Pilot — Stripe */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative rounded-2xl p-8 flex flex-col bg-blue-600/10 border-2 border-blue-500"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              {p.pilotLabel}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{p.pilot.name}</h2>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-5xl font-extrabold">{p.pilot.price}</span>
              <span className="text-gray-400 mb-1.5 text-lg">{p.pilot.period}</span>
            </div>
            <p className="text-gray-400 text-sm">{p.pilot.description}</p>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {p.pilot.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/api/checkout?plan=pilot"
              className="block text-center font-semibold py-3.5 px-6 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition"
            >
              {p.pilot.cta}
            </Link>
          </motion.div>
          <p className="text-center text-xs text-gray-500 mt-3">{p.pilot.note}</p>
        </motion.div>

        {/* Enterprise / Gov — Proposal */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-2xl p-8 flex flex-col bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden" />

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎖️</span>
              <h2 className="text-2xl font-bold">{p.proposal.name}</h2>
            </div>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl font-extrabold text-gray-300">Custom</span>
            </div>
            <p className="text-gray-400 text-sm">{p.proposal.description}</p>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {p.proposal.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="mailto:william@agentnx.ai?subject=AgentNX Proposal Request"
              className="block text-center font-semibold py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              {p.proposal.cta}
            </a>
          </motion.div>
          <p className="text-center text-xs text-gray-500 mt-3">
            SDVOSB · SAM.gov Registered · IMAGE 101 LLC
          </p>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-4">
        <h3 className="text-xl font-bold mb-6 text-center">{p.faqHeading}</h3>
        <div className="space-y-4">
          {p.faq.map(({ q, a }) => (
            <motion.div
              key={q}
              whileHover={{ scale: 1.01 }}
              className="bg-white/5 border border-white/10 hover:border-blue-500/20 rounded-xl p-5 transition-colors"
            >
              <p className="font-semibold text-sm mb-2">{q}</p>
              <p className="text-gray-400 text-sm">{a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back link */}
      <div className="text-center mt-12">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition">
          {p.back}
        </Link>
      </div>
    </main>
  );
}

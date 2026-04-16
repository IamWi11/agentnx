"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const prices = ["$799", "$2,500", "$6,000+"];
const periods = ["/mo", "/mo", "/mo"];
const slugs = ["starter", "growth", "enterprise"];
const highlights = [false, true, false];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function PricingPage() {
  const { t, lang, setLang } = useLanguage();
  const p = t.pricing;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-20">

      {/* Language toggle */}
      <div className="flex justify-end max-w-5xl mx-auto mb-6">
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

      {/* Plans */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {p.plans.map((plan, i) => (
          <motion.div
            key={slugs[i]}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`relative rounded-2xl p-8 flex flex-col cursor-default ${
              highlights[i]
                ? "bg-blue-600/10 border-2 border-blue-500"
                : "bg-white/5 border border-white/10 hover:border-blue-500/30"
            } transition-colors`}
          >
            {highlights[i] && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {p.mostPopular}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-4xl font-extrabold">{prices[i]}</span>
                <span className="text-gray-400 mb-1">{periods[i]}</span>
              </div>
              <p className="text-gray-400 text-sm">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/api/checkout?plan=${slugs[i]}`}
                className={`block text-center font-semibold py-3 px-6 rounded-full transition ${
                  highlights[i]
                    ? "bg-blue-500 hover:bg-blue-400 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Gov/GovCon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto mt-12 text-center"
      >
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          className="bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-8 transition-colors"
        >
          <div className="text-2xl mb-2">🎖️</div>
          <h3 className="text-xl font-bold mb-2">{p.govTitle}</h3>
          <p className="text-gray-400 text-sm mb-4">{p.govDesc}</p>
          <motion.a
            href="mailto:william@agentnx.ai?subject=AgentNX Enterprise Inquiry"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            {p.govCta}
          </motion.a>
        </motion.div>
      </motion.div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-16">
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

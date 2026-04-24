"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const PLANS = [
  {
    id: "pilot",
    name: "Pilot",
    price: "$499",
    period: "/mo",
    calls: "Up to 200 calls/day",
    badge: null as string | null,
    highlight: false,
    cardClass: "border-white/10 hover:border-white/20 bg-white/[0.03]",
    ctaClass: "bg-white/10 hover:bg-white/20 text-white",
    checkClass: "text-blue-400",
    href: "/api/checkout?plan=pilot",
    isEmail: false,
    cta: "Start Pilot",
    description: "One voice agent, live in days. Month-to-month, no commitment.",
    features: [
      "1 voice agent — your choice of vertical",
      "Up to 200 calls/day",
      "Standard onboarding",
      "Call logs + transcripts",
      "Cancel anytime — no penalties",
    ],
    note: "Credit card · Instant access · No contract",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$999",
    period: "/mo",
    calls: "200–500 calls/day",
    badge: "Most Popular",
    highlight: true,
    cardClass: "border-blue-500/60 bg-blue-500/[0.06] ring-1 ring-blue-500/20",
    ctaClass: "bg-blue-500 hover:bg-blue-400 text-white",
    checkClass: "text-blue-400",
    href: "/api/checkout?plan=starter",
    isEmail: false,
    cta: "Get Started",
    description: "For growing teams ready to automate at scale.",
    features: [
      "1 voice agent — any vertical",
      "Up to 500 calls/day",
      "Priority onboarding",
      "Webhook / API access",
      "Call logs + full transcripts",
    ],
    note: "Credit card · No contract",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$2,499",
    period: "/mo",
    calls: "500–1,000 calls/day",
    badge: null as string | null,
    highlight: false,
    cardClass: "border-white/10 hover:border-white/20 bg-white/[0.03]",
    ctaClass: "bg-white/10 hover:bg-white/20 text-white",
    checkClass: "text-blue-400",
    href: "/api/checkout?plan=growth",
    isEmail: false,
    cta: "Get Started",
    description: "Multi-agent operations across your entire org.",
    features: [
      "Up to 3 voice agents",
      "Up to 1,000 calls/day",
      "Custom integrations",
      "Dedicated onboarding + SLA",
      "Full transcript analytics",
    ],
    note: "Billed monthly",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    calls: "1,000+ calls/day",
    badge: "Gov · Pharma",
    highlight: false,
    cardClass: "border-emerald-500/30 hover:border-emerald-500/60 bg-white/[0.03]",
    ctaClass: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40",
    checkClass: "text-emerald-400",
    href: "mailto:william@agentnx.ai?subject=AgentNX Proposal Request",
    isEmail: true,
    cta: "Request Proposal",
    description: "Government, pharma, and multi-agency deployments.",
    features: [
      "SDVOSB sole-source eligible — up to $5M (VA) / $4.5M (other agencies)",
      "Unlimited agents + custom verticals",
      "Custom integrations (Veeva, ServiceNow, Splunk)",
      "NIST 800-53 · FedRAMP path · ATO support",
      "21 CFR Part 11 · GxP · HIPAA BAA",
    ],
    note: "SDVOSB · SAM.gov Active · IMAGE 101 LLC",
  },
];

const FAQ = [
  { q: "How fast can my pilot be live?", a: "Most pilots are configured and live within 5 business days of onboarding." },
  { q: "Is there per-minute or per-call billing?", a: "No. Plans are flat monthly rates — no per-minute, per-call, or per-deviation charges." },
  { q: "Can I cancel anytime?", a: "Yes. Month-to-month. Cancel through your billing portal with no penalties." },
  { q: "Why no public pricing for enterprise?", a: "Government contracts, pharma deployments, and multi-agent builds vary significantly in scope. A proposal ensures the right configuration at the right price — not a generic tier." },
];

export default function PricingPage() {
  const { lang, setLang } = useLanguage();

  return (
    <main className="min-h-screen bg-[#080c18] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-[#080c18]/80">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Agent<span className="text-blue-400">NX</span>
          <span className="text-blue-400">.ai</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/voice" className="text-gray-400 hover:text-white text-sm transition">Demos</Link>
          <Link href="/mcp-demo" className="text-gray-400 hover:text-white text-sm transition">MCP Demo</Link>
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
      </nav>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-14 text-center">
        <motion.div initial="hidden" animate="visible" className="flex flex-col items-center gap-4">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Transparent Pricing · No Hidden Fees
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
            Start a pilot.<br />
            <span className="text-blue-400">Scale when it works.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-gray-400 max-w-xl leading-relaxed">
            One fixed-price pilot to prove ROI. Scale to full enterprise or government deployment when you're ready.
          </motion.p>
        </motion.div>
      </div>

      {/* 4-plan grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              custom={i}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all ${plan.cardClass}`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap ${
                  plan.id === "enterprise"
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                    : "bg-blue-500 text-white"
                }`}>
                  {plan.badge}
                </span>
              )}

              <div className="mb-5 mt-2">
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-blue-400" : "text-gray-500"}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-0.5 mb-1">
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 mb-1 text-sm ml-0.5">{plan.period}</span>}
                </div>
                <div className="text-xs text-gray-600">{plan.calls}</div>
              </div>

              <p className="text-gray-400 text-xs leading-relaxed mb-5">{plan.description}</p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className={`mt-0.5 flex-shrink-0 ${plan.checkClass}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.isEmail ? (
                <a
                  href={plan.href}
                  className={`block text-center text-sm font-semibold py-2.5 px-4 rounded-full transition-all ${plan.ctaClass}`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={plan.href}
                  className={`block text-center text-sm font-semibold py-2.5 px-4 rounded-full transition-all ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Link>
              )}

              {plan.note && <p className="text-center text-[10px] text-gray-600 mt-2.5 leading-relaxed">{plan.note}</p>}
            </motion.div>
          ))}
        </div>

        {/* Compliance strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-10"
        >
          {["SDVOSB Certified", "SAM.gov Active", "NIST 800-53", "HIPAA Ready", "21 CFR Part 11", "FedRAMP Path"].map((badge) => (
            <span key={badge} className="text-[11px] font-semibold text-gray-500 border border-white/10 px-3 py-1 rounded-full">
              {badge}
            </span>
          ))}
        </motion.div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-xl font-bold mb-8 text-center"
          >
            Common questions
          </motion.h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={item.q}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white/[0.03] border border-white/10 hover:border-blue-500/20 rounded-xl p-5 transition-colors"
              >
                <p className="font-semibold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 p-10 text-center"
        >
          <motion.h3 variants={fadeUp} className="text-2xl font-extrabold mb-2">Not sure which plan fits?</motion.h3>
          <motion.p variants={fadeUp} custom={1} className="text-gray-400 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
            Talk to the AgentNX AI — it'll qualify your use case and recommend the right tier in under 3 minutes.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/voice"
              className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all"
            >
              Talk to the AI →
            </Link>
            <a
              href="mailto:william@agentnx.ai?subject=AgentNX Pricing Question"
              className="px-8 py-3 rounded-full border border-white/20 text-gray-300 hover:text-white hover:border-white/40 font-semibold text-sm transition-all"
            >
              Email us directly
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-8 text-center text-gray-700 text-xs">
        © 2026 AgentNX.ai · IMAGE 101 LLC · Service-Disabled Veteran-Owned Small Business
        <span className="mx-3">·</span>
        <Link href="/voice" className="hover:text-gray-400 transition">Voice Demos</Link>
        <span className="mx-3">·</span>
        <Link href="/mcp-demo" className="hover:text-gray-400 transition">MCP Demo</Link>
      </footer>
    </main>
  );
}

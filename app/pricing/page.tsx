"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$299",
    period: "/mo",
    slug: "starter",
    description: "One voice agent. Always on. Handles calls so you don't have to.",
    features: [
      "1 custom voice agent",
      "Up to 500 calls/month",
      "VAPI-powered (phone + web)",
      "Standard onboarding",
      "Email support",
      "Monthly performance report",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$999",
    period: "/mo",
    slug: "growth",
    description: "Multiple agents. Custom scripts. Built for teams that are scaling.",
    features: [
      "3 custom voice agents",
      "Up to 2,000 calls/month",
      "Custom call scripts & flows",
      "CRM integration",
      "Priority support",
      "Weekly performance reports",
      "Apollo.io outbound integration",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$2,500",
    period: "/mo",
    slug: "enterprise",
    description: "Unlimited agents. White-label ready. Built for compliance-heavy industries.",
    features: [
      "Unlimited voice agents",
      "Unlimited calls",
      "GxP / HIPAA-ready documentation",
      "White-label option",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Get Started",
    highlight: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-20">
      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3"
        >
          Pricing
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mb-4"
        >
          Pay for outcomes,<br />not headcount.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Voice agents that handle calls 24/7. No salaries, no benefits, no sick days.
        </motion.p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.slug}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className={`relative rounded-2xl p-8 flex flex-col ${
              plan.highlight
                ? "bg-blue-600/10 border-2 border-blue-500"
                : "bg-white/5 border border-white/10"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400 mb-1">{plan.period}</span>
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

            <Link
              href={`/api/checkout?plan=${plan.slug}`}
              className={`block text-center font-semibold py-3 px-6 rounded-full transition ${
                plan.highlight
                  ? "bg-blue-500 hover:bg-blue-400 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Custom/GovCon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto mt-12 text-center"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-2xl mb-2">🎖️</div>
          <h3 className="text-xl font-bold mb-2">Government / GovCon / Pharma</h3>
          <p className="text-gray-400 text-sm mb-4">
            Custom pricing for federal contracts, SDVOSB set-asides, and regulated industries.
            IMAGE 101 LLC is SAM.gov registered · SDVOSB · Veteran-Owned.
          </p>
          <a
            href="mailto:william@image101llc.com?subject=AgentNX Enterprise Inquiry"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Contact William Directly
          </a>
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Common questions</h3>
        <div className="space-y-4">
          {[
            {
              q: "How fast can my agent be live?",
              a: "Most agents are configured and live within 5 business days of onboarding.",
            },
            {
              q: "What if I go over my call limit?",
              a: "Overage calls are billed at $0.08/minute. You'll get an alert before that happens.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Month-to-month. Cancel through your billing portal with no penalties.",
            },
            {
              q: "Is this HIPAA or GxP compliant?",
              a: "Enterprise tier includes compliance documentation. Contact us for regulated industry requirements.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="font-semibold text-sm mb-2">{q}</p>
              <p className="text-gray-400 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back link */}
      <div className="text-center mt-12">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition">
          ← Back to AgentNX.ai
        </Link>
      </div>
    </main>
  );
}

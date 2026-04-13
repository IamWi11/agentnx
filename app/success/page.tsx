"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-extrabold mb-4">You&apos;re in.</h1>
        <p className="text-gray-400 text-lg mb-8">
          Your AgentNX subscription is active. William will personally reach out
          within 24 hours to kick off your voice agent setup.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8">
          <p className="text-sm text-gray-400 mb-1">What happens next:</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📧 Confirmation email on its way</li>
            <li>📞 Onboarding call scheduled within 24 hours</li>
            <li>🤖 Voice agent configured to your workflow</li>
            <li>🚀 Live within 5 business days</li>
          </ul>
        </div>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Back to AgentNX.ai
        </Link>
      </motion.div>
    </main>
  );
}

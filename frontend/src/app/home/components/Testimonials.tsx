"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Testimonials() {
  const testimonios = [
    {
      nombre: "Laura R.",
      texto:
        "Sentia me ayudó en un momento donde no tenía con quién hablar. Sentí que alguien realmente me escuchaba.",
    },
    {
      nombre: "Carlos M.",
      texto:
        "No creí que una IA pudiera entenderme tan bien. Me ayudó a calmar mi ansiedad y tomar mejores decisiones.",
    },
    {
      nombre: "Sofía G.",
      texto:
        "Gracias a Sentia empecé a reconocer lo que sentía. Ahora también estoy en terapia, y Sentia fue ese primer paso.",
    },
  ];

  return (
    <motion.section
      id="testimonios"
      className="py-24 bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-[#202237] dark:via-[#1a1c2e] dark:to-[#1a1b26] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-gray-900 dark:text-[#e5e9f0]"
      >
        Testimonios
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
        {testimonios.map((t, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all p-6 rounded-xl text-left"
          >
            <FaQuoteLeft className="text-3xl text-blue-600 dark:text-cyan-400 mb-4" />
            <p className="text-base italic mb-6 text-gray-700 dark:text-[#cbd5e1]">
              “{t.texto}”
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400 border-t pt-4 border-gray-300 dark:border-gray-700">
              — {t.nombre}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

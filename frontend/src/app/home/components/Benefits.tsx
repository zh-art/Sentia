"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Benefits() {
  const features = [
    {
      icon: "🔒",
      title: "Privacidad Total",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-300/10 dark:text-yellow-300",
      text: "Cifrado extremo a extremo y chats anónimos para que te sientas seguro siempre.",
    },
    {
      icon: "💙",
      title: "Empatía Inteligente",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-300/10 dark:text-blue-300",
      text: "Respuestas adaptadas a tus emociones detectadas en tiempo real.",
    },
    {
      icon: "🕐",
      title: "Accesible 24/7",
      color: "bg-gray-200 text-gray-700 dark:bg-gray-300/10 dark:text-gray-300",
      text: "Disponible en cualquier momento y desde cualquier lugar.",
    },
  ];

  return (
    <motion.section
      id="features"
      className="py-24 bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-gray-900 dark:text-[#e5e9f0]"
      >
        ¿Por qué elegir Sentia?
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto px-6">
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-md p-6 rounded-xl transition-all hover:shadow-lg"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full mb-4 ${f.color}`}
            >
              {f.icon}
            </div>

            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-[#e5e9f0]">
              {f.title}
            </h3>
            <p className="text-gray-700 dark:text-[#cbd5e1]">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

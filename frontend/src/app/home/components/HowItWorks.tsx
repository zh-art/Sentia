"use client";

import { motion } from "framer-motion";
import { FaRegCommentDots, FaBrain, FaArrowRight } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HowItWorks() {
  const pasos = [
    {
      icon: <FaRegCommentDots />,
      title: "1. Escribe lo que sientes",
      text: "Exprésate libremente. Puedes contar lo que quieras, sin filtros ni juicios.",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-300/10 dark:text-blue-300",
    },
    {
      icon: <FaBrain />,
      title: "2. Sentia te escucha",
      text: "La IA analiza tu estado emocional y te responde con empatía, contención y orientación.",
      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-300",
    },
    {
      icon: <FaArrowRight />,
      title: "3. Toma acción",
      text: "Obtén sugerencias, herramientas o contacta a un profesional si lo deseas.",
      color: "bg-gray-200 text-gray-700 dark:bg-gray-300/10 dark:text-gray-300",
    },
  ];

  return (
    <motion.section
      id="funciona"
      className="py-24 bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-gray-900 dark:text-[#e5e9f0]"
      >
        ¿Cómo funciona?
      </motion.h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6 text-left">
        {pasos.map((paso, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all p-6 rounded-xl"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center text-xl rounded-full mb-4 ${paso.color}`}
            >
              {paso.icon}
            </div>

            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-[#e5e9f0]">
              {paso.title}
            </h3>
            <p className="text-gray-700 dark:text-[#cbd5e1]">{paso.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

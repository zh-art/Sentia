"use client";

import { motion } from "framer-motion";
import { GiBrain } from "react-icons/gi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function About() {
  return (
    <motion.section
      id="sobre"
      className="py-24 bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-[#202237] dark:via-[#1a1c2e] dark:to-[#1a1b26] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div
        variants={fadeInUp}
        className="flex justify-center mb-6 text-blue-600 dark:text-cyan-400 text-5xl"
      >
        <GiBrain />
      </motion.div>

      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-6 text-gray-900 dark:text-[#e5e9f0]"
      >
        ¿Qué es Sentia?
      </motion.h2>

      <motion.p
        variants={fadeInUp}
        className="italic text-blue-600 dark:text-cyan-400 text-lg mb-10 font-medium"
      >
        “Donde termina el ruido del mundo, comienza el espacio para escuchar lo
        que sientes.”
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-[#cbd5e1] space-y-8 px-4 leading-relaxed"
      >
        <p>
          Sentia es una asistente emocional impulsada por inteligencia
          artificial, entrenada para acompañar a personas que atraviesan
          momentos difíciles. Está diseñada para ofrecer un espacio seguro,
          privado y empático donde puedas hablar, desahogarte o reflexionar sin
          juicios.
        </p>
        <p>
          A través de modelos lingüísticos avanzados y detección emocional,
          Sentia adapta sus respuestas a tu estado de ánimo. No reemplaza a un
          psicólogo, pero puede ser esa primera conversación que necesitas
          cuando sientes que no hay nadie más.
        </p>
      </motion.div>
    </motion.section>
  );
}

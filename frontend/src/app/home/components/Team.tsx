"use client";

import { motion } from "framer-motion";
import { FaUserMd } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Team() {
  return (
    <motion.section
      id="equipo"
      className="py-24 bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-[#202237] dark:via-[#1a1c2e] dark:to-[#1a1b26] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div
        variants={fadeInUp}
        className="flex justify-center mb-6 text-blue-600 dark:text-cyan-400 text-5xl"
      >
        <FaUserMd />
      </motion.div>

      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-8 text-gray-900 dark:text-[#e5e9f0]"
      >
        Equipo profesional detrás
      </motion.h2>

      <motion.div
        variants={fadeInUp}
        className="max-w-4xl mx-auto text-lg text-gray-700 dark:text-[#cbd5e1] space-y-8 px-6 leading-relaxed"
      >
        <p>
          Sentia ha sido diseñada y validada con el acompañamiento directo de
          profesionales en salud mental, psicólogos clínicos, ingenieros en
          inteligencia artificial, investigadores en neurociencia y expertos en
          ética digital.
        </p>
        <p>
          Este equipo multidisciplinario garantiza que cada interacción con
          Sentia esté basada en principios científicos, empáticos y
          responsables. Desde el tono de los mensajes hasta la lógica del modelo
          emocional, todo ha sido cuidadosamente supervisado.
        </p>
        <p>
          Aunque Sentia no reemplaza una terapia formal, creemos profundamente
          en el valor de brindar un acompañamiento inicial accesible, seguro y
          humano. Porque cada paso hacia el bienestar emocional cuenta.
        </p>
      </motion.div>
    </motion.section>
  );
}

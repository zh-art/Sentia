"use client";

import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { toast } from "react-toastify";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ContactForm() {
  return (
    <motion.section
      id="contacto"
      className="py-24 bg-gradient-to-b from-purple-100 via-indigo-50 to-white dark:from-[#202237] dark:via-[#1a1c2e] dark:to-[#1a1b26] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.div
        variants={fadeInUp}
        className="flex justify-center mb-6 text-blue-600 dark:text-cyan-400 text-4xl"
      >
        <FaEnvelopeOpenText />
      </motion.div>

      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-4 text-gray-900 dark:text-[#e5e9f0]"
      >
        ¿Deseas contactarnos?
      </motion.h2>

      <motion.p
        variants={fadeInUp}
        className="text-lg text-gray-700 dark:text-[#cbd5e1] mb-12"
      >
        Ya sea para colaborar, hacer sugerencias o buscar ayuda profesional,
        estamos aquí para escucharte.
      </motion.p>

      <motion.form
        variants={fadeInUp}
        className="max-w-xl mx-auto space-y-6 px-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("¡Gracias por tu mensaje! 📨");
        }}
      >
        <input
          type="text"
          placeholder="Tu nombre"
          required
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        />
        <textarea
          rows={4}
          placeholder="Escribe tu mensaje..."
          required
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
        ></textarea>
        <button
          type="submit"
          className="bg-[#2563eb] dark:bg-cyan-500 hover:bg-[#1d4ed8] dark:hover:bg-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg font-medium transform transition-transform duration-300 hover:scale-105 cursor-pointer"
        >
          Enviar mensaje
        </button>
      </motion.form>
    </motion.section>
  );
}

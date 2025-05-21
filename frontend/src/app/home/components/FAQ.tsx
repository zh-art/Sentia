"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaQuestionCircle,
  FaLock,
  FaUserShield,
  FaComments,
} from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FAQ() {
  const [abierta, setAbierta] = useState<number | null>(null);

  const preguntas = [
    {
      icon: <FaComments />,
      pregunta: "¿Sentia reemplaza a un psicólogo?",
      respuesta:
        "No. Sentia es un acompañante emocional basado en IA, diseñado para ayudarte a iniciar una conversación contigo mismo. Para procesos terapéuticos profundos, recomendamos consultar a un profesional.",
    },
    {
      icon: <FaLock />,
      pregunta: "¿Mis conversaciones son privadas?",
      respuesta:
        "Sí. Tus mensajes no se almacenan y las conversaciones son anónimas. Nos enfocamos en ofrecerte un espacio seguro y libre de juicios.",
    },
    {
      icon: <FaUserShield />,
      pregunta: "¿Sentia puede saber quién soy o identificarme?",
      respuesta:
        "No. Sentia no recolecta ni utiliza información personal. No hay registros, cookies de identificación ni trazabilidad de tu identidad.",
    },
    {
      icon: <FaQuestionCircle />,
      pregunta: "¿Puedo hablar con un humano si lo necesito?",
      respuesta:
        "En versiones futuras podrás solicitar ser redirigido con un psicólogo real. Esta funcionalidad está en desarrollo como parte de nuestro compromiso con el bienestar emocional completo.",
    },
  ];

  return (
    <motion.section
      id="faq"
      className="py-24 bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237] text-center transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <motion.h2
        variants={fadeInUp}
        className="text-4xl font-bold mb-12 text-gray-900 dark:text-[#e5e9f0]"
      >
        Preguntas Frecuentes
      </motion.h2>

      <div className="max-w-3xl mx-auto text-left space-y-6 px-6">
        {preguntas.map((item, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-md hover:shadow-lg transition-all p-5 rounded-xl cursor-pointer"
          >
            <button
              onClick={() => setAbierta(abierta === idx ? null : idx)}
              className="w-full flex items-start gap-4 text-left"
            >
              <div className="text-blue-600 dark:text-cyan-400 text-xl mt-1">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#e5e9f0]">
                {item.pregunta}
              </h3>
            </button>

            {abierta === idx && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
                className="mt-4 pl-10 text-gray-700 dark:text-[#cbd5e1]"
              >
                {item.respuesta}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

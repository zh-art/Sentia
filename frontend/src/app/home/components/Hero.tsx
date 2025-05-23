"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  const router = useRouter();

  return (
    <motion.section
      id="inicio"
      className="py-24 md:py-32 px-6 bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-[#1a1b26] dark:via-[#1a1c2e] dark:to-[#202237] transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <motion.div
          className="text-center md:text-left flex-1"
          variants={fadeInUp}
        >
          <div className="text-4xl mb-4">🧠🤖💬</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-[#e5e9f0]">
            Tu espacio seguro empieza con{" "}
            <span className="text-blue-600">Sentia</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-gray-700 dark:text-[#cbd5e1] mb-8">
            Una IA emocional que te escucha, te comprende y te acompaña. Siempre
            que lo necesites.
          </p>

          <motion.button
            variants={fadeInUp}
            onClick={() => router.push("/chat")}
            className="bg-[#2563eb] dark:bg-cyan-500 hover:bg-[#1d4ed8] dark:hover:bg-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg font-medium transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            Iniciar chat con Sentia
          </motion.button>
        </motion.div>

        <motion.div
          className="flex-1 hidden md:flex justify-center"
          variants={fadeInUp}
        >
          <Image
            src="/Illustrations/undraw_holding-flowers_jc03.svg"
            alt="Ilustración de acompañamiento emocional"
            width={420}
            height={420}
            className="w-full max-w-md h-auto drop-shadow-xl"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

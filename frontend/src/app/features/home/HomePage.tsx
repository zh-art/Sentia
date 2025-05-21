'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/Navbar';

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/landing');
  };
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition duration-300">
      <Navbar title={"Home"} items={[
        { name: "Sobre Nosotros", url: "/sobre-nosotros" },
        { name: "Actualizaciones", url: "/actualizaciones" }
      ]} />
      <motion.section
        className="py-32 text-center px-4 bg-blue-100 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold mb-6">Bienvenido a Sentia</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Una asistente virtual basada en inteligencia artificial creada para
          escucharte, comprenderte y apoyarte en momentos difíciles.
        </p>

        <button
          className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          onClick={goToLogin}
        >
          Iniciar Chat con Sentia
        </button>
      </motion.section>

      <section className="py-24 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">¿Qué es Sentia?</h2>
        <p className="max-w-3xl mx-auto text-lg">
          Sentia es una asistente virtual especializada en salud mental que
          utiliza tecnologías de IA para ofrecer un acompañamiento
          personalizado, seguro y empático a personas que enfrentan síntomas de
          depresión.
        </p>
      </section>

      <section className="py-24 bg-blue-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">¿Por qué elegir Sentia?</h2>

          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold mb-2">Privacidad Total</h3>
              <p>
                Cifrado extremo a extremo y chats anónimos para que te sientas
                seguro siempre.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Empatía Inteligente
              </h3>
              <p>
                Respuestas adaptadas a tus emociones detectadas en tiempo real.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Accesible 24/7</h3>
              <p>Disponible en cualquier momento y desde cualquier lugar.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};


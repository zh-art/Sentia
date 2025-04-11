"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LandingSentia() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition duration-300">
      <head>
        <title>Sentia - Tu apoyo emocional virtual</title>
        <meta name="description" content="Sentia es tu acompañante emocional basado en IA, listo para escucharte y ayudarte cuando más lo necesites." />
        <meta property="og:title" content="Sentia - Tu apoyo emocional virtual" />
        <meta property="og:description" content="Sentia es tu acompañante emocional basado en IA, listo para escucharte y ayudarte cuando más lo necesites." />
        <meta property="og:image" content="/sentia-og.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      {/* Navbar */}
      <header className="p-6 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sentia</h1>
          <nav className="flex gap-6 text-sm">
            <a href="#inicio" className="hover:text-blue-600">Inicio</a>
            <a href="#sobre" className="hover:text-blue-600">Sobre Nosotros</a>
            <a href="#features" className="hover:text-blue-600">Actualizaciones</a>
            <button onClick={() => setDarkMode(!darkMode)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition" onClick={() => window.location.href = '/chat'}>
              Iniciar chat
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section id="inicio" className="py-20 bg-blue-50 dark:bg-gray-800 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <h2 className="text-4xl font-bold mb-4">Bienvenido a Sentia</h2>
        <p className="max-w-xl mx-auto text-lg">Tu acompañante virtual para momentos difíciles. Hablemos, Sentia está aquí para escucharte.</p>
      </motion.section>

      {/* Sobre Nosotros */}
      <motion.section id="sobre" className="py-16 container mx-auto px-4 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h3 className="text-3xl font-semibold mb-4">Sobre Nosotros</h3>
        <p className="max-w-2xl mx-auto text-lg">Sentia es un sistema de inteligencia artificial diseñado para ser un espacio seguro y privado donde las personas puedan expresarse libremente, siendo escuchadas y orientadas.</p>
      </motion.section>

      {/* Features - Actualizaciones */}
      <motion.section id="features" className="py-16 container mx-auto px-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h3 className="text-3xl font-semibold mb-8 text-center">Actualizaciones - Control de versiones</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2">v1.0 - Detección Emocional</h4>
            <p>Sentia ahora es capaz de detectar emociones en tiempo real y ajustar su respuesta para mayor empatía.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2">v1.1 - Conexión Profesional</h4>
            <p>Posibilidad de conectarte con un psicólogo real directamente desde la plataforma.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2">v1.2 - Privacidad Mejorada</h4>
            <p>Funcionalidad de mensajes autodestructibles para cuidar la confidencialidad del usuario.</p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Sentia. Todos los derechos reservados.
      </footer>
    </div>
  );
}

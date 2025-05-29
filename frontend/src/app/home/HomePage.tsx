"use client";

import Navbar from "@/app/features/navbar/Navbar";
import ThemeToggle from "@/app/features/theme/ThemeToggle";
import Hero from "./components/Hero";
import About from "./components/About";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
import HowItWorks from "./components/HowItWorks";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition duration-300">
      <Navbar  />
      <ThemeToggle />
      <Hero />
      <About />
      <Benefits />
      <Testimonials />
      <HowItWorks />
      <Team />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}

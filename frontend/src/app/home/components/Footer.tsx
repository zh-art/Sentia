export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1b26] border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      © {new Date().getFullYear()} Sentia. Todos los derechos reservados. |{" "}
      Desarrollado con 💙 en Colombia
    </footer>
  );
}

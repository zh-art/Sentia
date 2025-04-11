import type { Metadata } from "next";
import { montserrat } from "@/app/styles/fonts";
import "./styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
// import Navbar from "@/app/features/navbar/Navbar";

export const metadata: Metadata = {
  title: "Sentia",
  description:
    "Sentia es una asistente virtual basada en inteligencia artificial diseñada para ofrecer apoyo a personas que enfrentan síntomas de depresión.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <UserProvider>
        <body className={`${montserrat.variable} antialiased`}>
          {" "}
          {/* <Navbar /> */}
          {children}
        </body>
      </UserProvider>
    </html>
  );
}

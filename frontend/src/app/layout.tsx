import type { Metadata } from "next";
import { montserrat } from "@/app/styles/fonts";
import "./styles/globals.css";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { auth0 } from "@/lib/auth0";
// import Navbar from "@/app/features/navbar/Navbar";

export const metadata: Metadata = {
  title: "Sentia",
  description:
    "Sentia es una asistente virtual basada en inteligencia artificial diseñada para ofrecer apoyo a personas que enfrentan síntomas de depresión.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();  // obten sesión en SSR
  return (
    <html>
      <body className={`${montserrat.variable} antialiased`}>
        <Auth0Provider user={session?.user}>
          {" "}
          {/* <Navbar />  */}
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}

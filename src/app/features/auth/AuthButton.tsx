"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function AuthButton() {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Cargando...</p>;

  return user ? (
    <div>
      <p>Bienvenido, {user.name}!</p>
      <Link href="/api/auth/logout">Cerrar sesión</Link>
    </div>
  ) : (
    <Link href="/api/auth/login">Iniciar sesión</Link>
  );
}

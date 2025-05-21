"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import LogoutButton from "../auth/LogoutButton";


interface NavItem {
  name: string;
  url: string;
}

interface NavbarProps {
  title: string;
  items: NavItem[];
}

export default function Navbar({ title, items }: NavbarProps) {
  const { user, isLoading } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">{title}</h1>

        <div className="hidden md:flex gap-6 items-center text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="hover:text-blue-600 transition"
            >
              {item.name}
            </Link>
          ))}

          {!isLoading && (
            user ? (
              <>
                <Link href="/admin" className="hover:text-blue-600 transition">
                  Administración
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/landing"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Iniciar Sesión
              </Link>
            )
          )}

          <ThemeToggle />
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)}>
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-3/4 max-w-xs bg-white dark:bg-gray-900 p-8 shadow-xl flex flex-col gap-6">

            <button onClick={() => setOpen(false)} className="self-end">
              <X className="w-6 h-6" />
            </button>

            <Link href="/" onClick={() => setOpen(false)} className="text-lg">
              Inicio
            </Link>

            <Link href="/sobre-nosotros" onClick={() => setOpen(false)} className="text-lg">
              Sobre Nosotros
            </Link>

            <Link href="/actualizaciones" onClick={() => setOpen(false)} className="text-lg">
              Actualizaciones
            </Link>

            <Link href="/chat" onClick={() => setOpen(false)}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition w-full text-sm">
                Iniciar Chat
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

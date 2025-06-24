'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

function Header() {
  const [isOpen, setOpen] = useState(false)

  const toggleMenu = () => setOpen(!isOpen)
  const closeMenu = () => setOpen(false)

  const navigation = [
    { name: 'Inicio', href: '#' },
    { name: 'Propósito', href: '#proposito' },
    { name: 'Equipo', href: '#equipo' },
    { name: 'Eventos', href: '#eventos' },
    { name: 'Participar', href: '#participar' },
  ]

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-sm font-normal text-black tracking-wider" style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>
            CASA
          </Link>
        </div>

        {/* Desktop Navigation - Very minimal */}
        <nav className="hidden md:flex items-center space-x-8">
          <button className="text-xs uppercase tracking-wider text-gray-600 hover:text-black transition-colors font-light">
            Contactar
          </button>
          <Link href="/auth/login">
            <button className="text-xs uppercase tracking-wider text-black hover:text-gray-600 transition-colors font-light">
              Admin
            </button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-black"
            onClick={toggleMenu}
          >
            <span className="sr-only">Menú</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export { Header }
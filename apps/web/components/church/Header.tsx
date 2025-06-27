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
    <header className="w-full z-40 fixed top-0 left-0 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-light text-black tracking-wider hover:text-gray-600 transition-colors" style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>
            CASA
          </Link>
        </div>

        {/* Desktop Navigation - Enhanced */}
        <nav className="hidden md:flex items-center space-x-8">
          <button className="text-sm tracking-wide text-gray-600 hover:text-black transition-all duration-200 font-light relative group">
            Contactar
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-200 group-hover:w-full"></span>
          </button>
          <Link href="/auth/login">
            <button className="px-4 py-2 text-sm tracking-wide text-white bg-black hover:bg-gray-800 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md">
              Admin
            </button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-black hover:text-gray-600 transition-colors p-2"
            onClick={toggleMenu}
          >
            <span className="sr-only">Menú</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <button 
                className="block text-sm text-gray-600 hover:text-black transition-colors"
                onClick={closeMenu}
              >
                Contactar
              </button>
              <Link href="/auth/login" onClick={closeMenu}>
                <button className="block w-full text-left text-sm text-black hover:text-gray-600 transition-colors">
                  Admin
                </button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export { Header }
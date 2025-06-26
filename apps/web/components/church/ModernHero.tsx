'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export function ModernHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Interactive gradient that follows mouse */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`,
        }}
      />

      {/* Mesh pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-purple-100">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Plataforma integral para iglesias</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                Gestiona tu iglesia
              </span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  con poder divino
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 8.5C1 8.5 89.5 1.5 179 1.5C268.5 1.5 357 8.5 357 8.5" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="1" y1="1.5" x2="357" y2="1.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9333EA"/>
                      <stop offset="1" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Una plataforma moderna que combina contabilidad, presentaciones y meditación guiada por IA 
              para transformar la administración de tu comunidad religiosa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup" className="group relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-70 group-hover:opacity-100" />
                <button className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 group-hover:scale-105 flex items-center gap-2">
                  Comienza gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 border border-gray-200">
                <Play className="w-5 h-5" />
                Ver demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                <p className="text-sm text-gray-600">Iglesias activas</p>
              </div>
              <div className="border-l pl-8">
                <h3 className="text-3xl font-bold text-gray-900">50k+</h3>
                <p className="text-sm text-gray-600">Miembros</p>
              </div>
              <div className="border-l pl-8">
                <h3 className="text-3xl font-bold text-gray-900">4.9</h3>
                <p className="text-sm text-gray-600">Calificación</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Floating cards showcase */}
            <div className="relative w-full h-[600px]">
              {/* Main card */}
              <div className="absolute top-10 left-10 w-80 h-48 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">$</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Contabilidad</h4>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Secondary card */}
              <div className="absolute top-32 right-5 w-72 h-40 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 animate-float animation-delay-2000">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Meditación IA</h4>
                </div>
                <p className="text-sm text-gray-600">Guías personalizadas con escrituras</p>
              </div>

              {/* Tertiary card */}
              <div className="absolute bottom-20 left-5 w-64 h-36 bg-white rounded-2xl shadow-2xl p-5 transform hover:scale-105 transition-all duration-300 animate-float animation-delay-4000">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Presentaciones</h4>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs">Canciones</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">Versículos</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-20 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-60" />
              <div className="absolute bottom-10 right-40 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-40" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
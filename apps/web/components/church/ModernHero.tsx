'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export function ModernHero() {
  const heroStyle = { fontFamily: 'Mont, Montserrat, sans-serif' }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white" style={heroStyle}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-gray-900 to-black rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-pulse-slow animation-delay-200" />
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-bl from-black to-gray-900 rounded-full mix-blend-multiply filter blur-3xl opacity-12 animate-pulse-slow animation-delay-100" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_center,black_40%,transparent_80%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full shadow-sm border border-gray-200">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-gray-900">Plataforma integral para iglesias</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight text-black">
              Gestiona tu iglesia
              <br />
              <span className="relative">
                con poder divino
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 358 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 8.5C1 8.5 89.5 1.5 179 1.5C268.5 1.5 357 8.5 357 8.5" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl font-light">
              Una plataforma moderna que combina contabilidad, presentaciones y meditación guiada por IA 
              para transformar la administración de tu comunidad religiosa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup" className="group relative inline-flex items-center justify-center">
                <button className="px-10 py-4 bg-black text-white font-medium rounded-2xl transition-all duration-300 group-hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-xl">
                  Comienza gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button className="group px-10 py-4 bg-white text-black font-medium rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 border-2 border-gray-200 hover:border-black">
                <Play className="w-5 h-5" />
                Ver demo
              </button>
            </div>

            <div className="flex gap-12 pt-12">
              <div>
                <h3 className="text-4xl font-light text-black">500+</h3>
                <p className="text-sm text-gray-600 font-medium">Iglesias activas</p>
              </div>
              <div className="border-l border-gray-200 pl-12">
                <h3 className="text-4xl font-light text-black">50k+</h3>
                <p className="text-sm text-gray-600 font-medium">Miembros</p>
              </div>
              <div className="border-l border-gray-200 pl-12">
                <h3 className="text-4xl font-light text-black">4.9</h3>
                <p className="text-sm text-gray-600 font-medium">Calificación</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-[600px]">
              <div className="absolute top-10 left-10 w-80 h-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                  <h4 className="font-medium text-black text-lg">Contabilidad</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Ingresos</span>
                    <span>$2.4M</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-gray-800 to-black rounded-full" />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Gastos</span>
                    <span>$1.2M</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="absolute top-32 right-5 w-72 h-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300 animate-fade-in animation-delay-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-black text-lg">Meditación IA</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Guías personalizadas con escrituras</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Sesión activa</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-5 w-64 h-36 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 animate-fade-in animation-delay-200">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h4 className="font-medium text-black text-lg">Presentaciones</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-200">Canciones</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 rounded-lg text-xs font-medium border border-purple-200">Versículos</span>
                  </div>
                  <div className="text-xs text-gray-500">24 presentaciones listas</div>
                </div>
              </div>

              {/* Enhanced decorative elements */}
              <div className="absolute top-0 right-20 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-2xl opacity-20 animate-pulse-slow" />
              <div className="absolute bottom-10 right-40 w-32 h-32 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-15 animate-pulse-slow animation-delay-300" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full blur-3xl opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
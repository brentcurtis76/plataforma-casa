'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

export function ModernHero() {
  const heroStyle = { fontFamily: 'Mont, Montserrat, sans-serif' }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white" style={heroStyle}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-900 rounded-full mix-blend-multiply filter blur-3xl opacity-2 animate-pulse" />
        <div className="absolute top-40 left-40 w-96 h-96 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-4 animate-pulse" />
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
              <div className="absolute top-10 left-10 w-80 h-48 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">$</span>
                  </div>
                  <h4 className="font-medium text-black text-lg">Contabilidad</h4>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-black rounded-full" />
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="absolute top-32 right-5 w-72 h-40 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-black text-lg">Meditación IA</h4>
                </div>
                <p className="text-sm text-gray-600">Guías personalizadas con escrituras</p>
              </div>

              <div className="absolute bottom-20 left-5 w-64 h-36 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h4 className="font-medium text-black text-lg">Presentaciones</h4>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium">Canciones</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium">Versículos</span>
                </div>
              </div>

              <div className="absolute top-0 right-20 w-24 h-24 bg-black rounded-full blur-2xl opacity-10" />
              <div className="absolute bottom-10 right-40 w-32 h-32 bg-gray-900 rounded-full blur-3xl opacity-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ProgressiveDisclosureProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function ProgressiveDisclosure({ 
  title, 
  subtitle, 
  children, 
  defaultOpen = false 
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-10 py-8 text-left hover:bg-gray-50/50 transition-all duration-300 group"
        style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-light text-black group-hover:text-gray-800 transition-colors">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 mt-2 font-light">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {isOpen ? 'Ocultar' : 'Ver más'}
            </span>
            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </div>
          </div>
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-10 pb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />
          {children}
        </div>
      </div>
    </div>
  )
}
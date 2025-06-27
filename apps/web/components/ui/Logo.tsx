'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showFallback?: boolean
}

export function Logo({ size = 'md', className = '', showFallback = true }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }
  
  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 64,
    xl: 80
  }
  
  const fallbackClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  // Try to load the actual logo file
  if (!imageError) {
    return (
      <div className={`${sizeClasses[size]} flex-shrink-0 ${className}`}>
        <Image
          src="/Logo CASA.png"
          alt="CASA Logo"
          width={sizePixels[size]}
          height={sizePixels[size]}
          className="object-contain rounded-xl w-full h-full"
          onError={() => setImageError(true)}
          priority
        />
      </div>
    )
  }

  // Final fallback to letter
  return (
    <div className={`${sizeClasses[size]} bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
      <span className={`${fallbackClasses[size]} font-bold text-gray-600`}>C</span>
    </div>
  )
}
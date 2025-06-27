'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { 
  LayoutDashboard, 
  Receipt, 
  Presentation, 
  Brain, 
  Settings,
  Users,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contabilidad', href: '/dashboard/accounting', icon: Receipt },
  { name: 'Presentaciones', href: '/dashboard/presentations', icon: Presentation },
  { name: 'Meditación', href: '/dashboard/meditation', icon: Brain },
  { name: 'Miembros', href: '/dashboard/members', icon: Users },
  { name: 'Eventos', href: '/dashboard/events', icon: Calendar },
  { name: 'Reportes', href: '/dashboard/reports', icon: FileText },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ fontFamily: 'Mont, Montserrat, sans-serif' }}>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-40 shadow-sm
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="px-6 py-8 border-b border-gray-100">
            <div className="flex items-center justify-center relative">
              <Logo size="lg" />
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block absolute right-0 p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {collapsed ? <ChevronRight className="h-5 w-5 text-gray-600" /> : <ChevronLeft className="h-5 w-5 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-black text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className={`px-6 py-6 border-t border-gray-100 ${collapsed ? 'px-3' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-black rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-medium text-sm">U</span>
              </div>
              {!collapsed && (
                <div className="text-sm">
                  <p className="font-medium text-black">Usuario</p>
                  <p className="text-gray-600 font-light">Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
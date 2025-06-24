'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="px-4 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-xl text-gray-900 transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                Church Admin
              </h2>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block p-1 hover:bg-gray-100 rounded"
              >
                {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span>{item.name}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className={`px-4 py-4 border-t border-gray-200 ${collapsed ? 'px-2' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
              {!collapsed && (
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Usuario</p>
                  <p className="text-gray-600">Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
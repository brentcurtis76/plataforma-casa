'use client'

import { useState, useEffect } from 'react'
import { Bug, Sparkles, Lightbulb, X, Send, FileDown, Zap, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'

type ReportType = 'bug' | 'feature' | 'improvement'

interface Report {
  id: string
  type: ReportType
  title: string
  description: string
  url: string
  timestamp: string
  status: 'open' | 'closed'
  priority: 'low' | 'medium' | 'high'
}

const typeConfig = {
  bug: {
    icon: Bug,
    label: 'Bug Report',
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  feature: {
    icon: Sparkles,
    label: 'Feature Request',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  improvement: {
    icon: Lightbulb,
    label: 'Improvement',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200'
  }
}

export function DevToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [reportType, setReportType] = useState<ReportType>('bug')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [reports, setReports] = useState<Report[]>([])

  // Load reports from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem('dev-reports')
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    }
  }, [])

  // Save reports to localStorage
  const saveReport = () => {
    if (!title || !description) {
      return
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType,
      title,
      description,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      status: 'open',
      priority
    }

    const updatedReports = [...reports, newReport]
    setReports(updatedReports)
    localStorage.setItem('dev-reports', JSON.stringify(updatedReports))

    // Reset form
    setTitle('')
    setDescription('')
    setPriority('medium')
    
    // Show success animation
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Copy to clipboard
    const reportText = `[${reportType.toUpperCase()}] ${title}\n\nDescription: ${description}\nPriority: ${priority}\nURL: ${window.location.href}\nTime: ${new Date().toLocaleString()}`
    navigator.clipboard.writeText(reportText)
  }

  // Export reports as JSON
  const exportReports = () => {
    const dataStr = JSON.stringify(reports, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `dev-reports-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const CurrentIcon = typeConfig[reportType].icon

  return (
    <>
      {/* Floating button with gradient */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
          
          {/* Button */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-4 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105">
            <Zap className="w-6 h-6" />
          </div>
          
          {/* Badge for report count */}
          {reports.filter(r => r.status === 'open').length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {reports.filter(r => r.status === 'open').length}
            </div>
          )}
        </div>
      </button>

      {/* Modern panel with backdrop blur */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[600px] overflow-hidden">
            {/* Glass morphism card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Quick Report
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Help us improve your experience</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Type selector with modern pills */}
                <div className="flex gap-2 mb-6">
                  {(Object.keys(typeConfig) as ReportType[]).map((type) => {
                    const config = typeConfig[type]
                    const Icon = config.icon
                    const isActive = reportType === type
                    
                    return (
                      <button
                        key={type}
                        onClick={() => setReportType(type)}
                        className={`flex-1 relative group transition-all duration-200 ${
                          isActive ? 'scale-105' : 'hover:scale-105'
                        }`}
                      >
                        <div className={`
                          p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-200
                          ${isActive 
                            ? `bg-gradient-to-r ${config.color} text-white shadow-lg` 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{config.label}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Form section with padding */}
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {/* Title input with floating label */}
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="peer w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder-transparent"
                      placeholder="Title"
                      id="title"
                    />
                    <label 
                      htmlFor="title"
                      className="absolute left-4 -top-2.5 bg-white dark:bg-gray-900 px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-600 peer-focus:text-sm"
                    >
                      Title
                    </label>
                  </div>

                  {/* Description with modern textarea */}
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="peer w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none placeholder-transparent"
                      placeholder="Description"
                      id="description"
                    />
                    <label 
                      htmlFor="description"
                      className="absolute left-4 -top-2.5 bg-white dark:bg-gray-900 px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-purple-600 peer-focus:text-sm"
                    >
                      Description
                    </label>
                  </div>

                  {/* Priority selector with modern badges */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                            priority === p
                              ? p === 'high' 
                                ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                : p === 'medium'
                                ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                                : 'bg-green-100 text-green-700 border-2 border-green-300'
                              : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          {p === 'high' && <AlertCircle className="w-4 h-4 inline mr-1" />}
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveReport}
                    disabled={!title || !description}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      title && description
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Submit Report
                  </button>
                  
                  {reports.length > 0 && (
                    <button
                      onClick={exportReports}
                      className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all duration-200 hover:scale-105"
                      title="Export reports"
                    >
                      <FileDown className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Success message */}
                {showSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Report submitted successfully!</p>
                      <p className="text-xs text-green-600 mt-0.5">Copied to clipboard</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent reports section */}
              {reports.length > 0 && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Recent Reports</h4>
                    <span className="text-xs text-gray-500">{reports.length} total</span>
                  </div>
                  <div className="space-y-2">
                    {reports.slice(-3).reverse().map((report) => {
                      const config = typeConfig[report.type]
                      const Icon = config.icon
                      
                      return (
                        <div 
                          key={report.id} 
                          className={`p-3 rounded-lg border ${config.borderColor} ${config.bgLight} group hover:shadow-sm transition-all duration-200`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg bg-white shadow-sm`}>
                              <Icon className={`w-4 h-4 ${config.textColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-800 truncate">{report.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(report.timestamp).toRelativeTimeString()}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

// Add this extension to Date prototype for relative time
declare global {
  interface Date {
    toRelativeTimeString(): string
  }
}

Date.prototype.toRelativeTimeString = function() {
  const seconds = Math.floor((new Date().getTime() - this.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years ago"
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months ago"
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days ago"
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours ago"
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes ago"
  
  return "Just now"
}
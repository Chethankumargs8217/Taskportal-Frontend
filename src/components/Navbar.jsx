import React, { useAuth } from '../context/AuthContext'
import { Zap, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-ink-100 tracking-tight">TaskPortal</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-ink-400">
            <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30
                            flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span>{user?.name ?? user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-rose-400
                       transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

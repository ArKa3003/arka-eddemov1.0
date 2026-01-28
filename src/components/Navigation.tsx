'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, BookOpen, BarChart3, Home } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/layout/mobile-nav'
import { cn } from '@/lib/utils'

export function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  // Navigation items for mobile menu
  const navItems = user
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/cases', label: 'Cases', icon: BookOpen },
        { href: '/progress', label: 'Progress', icon: BarChart3 },
        { href: '/profile', label: 'Profile', icon: User },
      ]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' },
      ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href={user ? '/dashboard' : '/'} 
            className="flex items-center space-x-2 focus-visible-ring rounded-md p-1"
            aria-label="ARKA-ED Home"
          >
            <span className="text-2xl font-bold text-cyan-600">ARKA</span>
            <span className="text-2xl font-bold text-slate-900">-ED</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1.5 focus-visible-ring rounded-md px-2 py-1"
                  aria-label="Go to Dashboard"
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  Dashboard
                </Link>
                <Link
                  href="/cases"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1.5 focus-visible-ring rounded-md px-2 py-1"
                  aria-label="Go to Cases"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  Cases
                </Link>
                <Link
                  href="/progress"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1.5 focus-visible-ring rounded-md px-2 py-1"
                  aria-label="Go to Progress"
                >
                  <BarChart3 className="w-4 h-4" aria-hidden="true" />
                  Progress
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1.5 focus-visible-ring rounded-md px-2 py-1"
                  aria-label="Go to Profile"
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  Profile
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-slate-600" aria-label={`Logged in as ${user.name}`}>
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 touch-target"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="touch-target">
                <Link href="/login" aria-label="Go to Login page">Login</Link>
              </Button>
              <Button variant="primary" size="sm" asChild className="touch-target">
                <Link href="/register" aria-label="Go to Register page">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile Navigation */}
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </nav>
  )
}

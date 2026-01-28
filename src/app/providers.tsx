'use client'

import { AuthProvider } from '@/context/AuthContext'
import { CaseProvider } from '@/context/CaseContext'
import { ToastProvider } from '@/providers/toast-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CaseProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CaseProvider>
    </AuthProvider>
  )
}

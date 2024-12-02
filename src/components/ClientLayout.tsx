'use client'

import { SavedPluginsProvider } from '@/contexts/SavedPluginsContext'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SavedPluginsProvider>
      {children}
    </SavedPluginsProvider>
  )
}

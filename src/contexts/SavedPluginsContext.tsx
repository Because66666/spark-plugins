'use client'

import React from 'react'
import { Plugin, SavedPlugin } from '@/types/plugin'

interface SavedPluginsContextType {
  savedPlugins: SavedPlugin[]
  savePlugin: (plugin: Plugin, version?: string, minecraftVersions?: string[]) => void
  removePlugin: (pluginId: string) => void
  isSaved: (pluginId: string) => boolean
  updatePluginVersion: (pluginId: string, version: string, minecraftVersions: string[]) => void
}

const SavedPluginsContext = React.createContext<SavedPluginsContextType | undefined>(undefined)

interface SavedPluginsProviderProps {
  children: React.ReactNode
}

export function SavedPluginsProvider({ children }: SavedPluginsProviderProps) {
  const [savedPlugins, setSavedPlugins] = React.useState<SavedPlugin[]>([])

  const savePlugin = React.useCallback((plugin: Plugin, version = 'latest', minecraftVersions: string[] = []) => {
    setSavedPlugins(prev => {
      const exists = prev.some(p => p.id === plugin.id)
      if (exists) return prev
      const savedPlugin: SavedPlugin = {
        ...plugin,
        savedAt: Date.now(),
        version,
        minecraftVersions
      }
      return [...prev, savedPlugin]
    })
  }, [])

  const updatePluginVersion = React.useCallback((pluginId: string, version: string, minecraftVersions: string[]) => {
    setSavedPlugins(prev => prev.map(p => 
      p.id === pluginId 
        ? { ...p, version, minecraftVersions }
        : p
    ))
  }, [])

  const removePlugin = React.useCallback((pluginId: string) => {
    setSavedPlugins(prev => prev.filter(p => p.id !== pluginId))
  }, [])

  const isSaved = React.useCallback((pluginId: string) => {
    return savedPlugins.some(p => p.id === pluginId)
  }, [savedPlugins])

  const value = React.useMemo(() => ({
    savedPlugins,
    savePlugin,
    removePlugin,
    isSaved,
    updatePluginVersion
  }), [savedPlugins, savePlugin, removePlugin, isSaved, updatePluginVersion])

  return (
    <SavedPluginsContext.Provider value={value}>
      {children}
    </SavedPluginsContext.Provider>
  )
}

export function useSavedPlugins() {
  const context = React.useContext(SavedPluginsContext)
  if (!context) {
    throw new Error('useSavedPlugins must be used within a SavedPluginsProvider')
  }
  return context
}
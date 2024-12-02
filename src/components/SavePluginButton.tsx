import React from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Plugin } from '../types/plugin'
import { useSavedPlugins } from '@/contexts/SavedPluginsContext'

interface SavePluginButtonProps {
  plugin: Plugin
}

export function SavePluginButton({ plugin }: SavePluginButtonProps) {
  const { savePlugin, removePlugin, isSaved } = useSavedPlugins()
  const saved = isSaved(plugin.id)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saved) {
      removePlugin(plugin.id)
    } else {
      // When using the save button, we'll save with a default version that will be updated later
      savePlugin(plugin, 'latest', [])
    }
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={saved ? 'Remove from saved plugins' : 'Save plugin'}
    >
      {saved ? (
        <BookmarkCheck className="h-5 w-5 text-emerald-500" />
      ) : (
        <Bookmark className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      )}
    </button>
  )
}
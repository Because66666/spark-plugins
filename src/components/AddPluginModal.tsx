'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useSavedPlugins } from '@/contexts/SavedPluginsContext'
import { Plugin } from '../types/plugin'

interface AddPluginModalProps {
  plugin: Plugin
  onClose: () => void
}

export function AddPluginModal({ plugin, onClose }: AddPluginModalProps) {
  const { savePlugin } = useSavedPlugins()
  const [selectedVersion, setSelectedVersion] = useState<string>('latest')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleAdd = () => {
    savePlugin(plugin, selectedVersion, []) // Using empty array for minecraftVersions as it will be updated later
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Plugin</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              添加 {plugin.name} 到你的下载列表
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {plugin.description}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            加入队列
          </button>
        </div>
      </div>
    </div>
  )
}
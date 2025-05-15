'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import PluginCard from './PluginCard'
import { Plugin } from '@/types/plugin'

export function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Plugin[]>([])
  const [selectedSource, setSelectedSource] = useState<'all' | 'modrinth' | 'spigot'>('all')

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&source=${selectedSource}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-dark-800/50 backdrop-blur rounded-xl p-4 ring-1 ring-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="检索插件..."
            className="w-full bg-dark-900/50 text-gray-100 rounded-lg pl-10 pr-4 py-2.5 ring-1 ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-sm text-gray-400 mt-4">检索插件中...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((plugin) => (
              <PluginCard key={`${plugin.provider}-${plugin.id}`} plugin={plugin} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">没有找到有关插件。要不换个关键词？</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
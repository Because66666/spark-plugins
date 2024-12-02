'use client'

import { Plugin } from '../types/plugin'
import PluginCard from './PluginCard'

interface SearchResultsProps {
  results: Plugin[]
  isLoading: boolean
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">No plugins found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((plugin) => (
        <PluginCard key={`${plugin.provider}-${plugin.id}`} plugin={plugin} />
      ))}
    </div>
  )
}
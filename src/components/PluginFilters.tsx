'use client'

import { PluginProvider } from '../types/plugin';

interface PluginFiltersProps {
  sources: PluginProvider[];
  onSourceToggle: (source: PluginProvider) => void;
}

export function PluginFilters({ sources, onSourceToggle }: PluginFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSourceToggle('modrinth')}
        className={`px-3 py-1.5 rounded-lg text-sm ${
          sources.includes('modrinth')
            ? 'bg-emerald-600 text-white'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        }`}
      >
        Modrinth
      </button>
      <button
        onClick={() => onSourceToggle('spigot')}
        className={`px-3 py-1.5 rounded-lg text-sm ${
          sources.includes('spigot')
            ? 'bg-blue-600 text-white'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        }`}
      >
        SpigotMC
      </button>
    </div>
  );
}
import { useState, useEffect } from 'react'
import { Plugin } from '@/types/plugin'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { PlusIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useSavedPlugins } from '@/contexts/SavedPluginsContext'

interface PluginCardProps {
  plugin: Plugin
  showActions?: boolean
}

interface VersionInfo {
  id: string
  name: string
  minecraftVersions: string[]
  releaseDate?: string
}

export default function PluginCard({ plugin, showActions = true }: PluginCardProps) {
  const { savePlugin, removePlugin, isSaved, updatePluginVersion } = useSavedPlugins()
  const [versions, setVersions] = useState<VersionInfo[]>([])
  const [selectedVersion, setSelectedVersion] = useState<VersionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isInQueue = isSaved(plugin.id)

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (plugin.provider === 'spigot') {
          const response = await fetch(`https://api.spiget.org/v2/resources/${plugin.id.replace('spigot-', '')}/versions?size=20&sort=-releaseDate`)
          if (!response.ok) throw new Error('Failed to fetch Spigot versions')
          const versions = await response.json()
          
          const formattedVersions: VersionInfo[] = versions.map((v: any) => ({
            id: String(v.id),
            name: v.name,
            minecraftVersions: v.testedVersions || [],
            releaseDate: new Date(v.releaseDate * 1000).toLocaleDateString()
          }))
          
          setVersions(formattedVersions)
          setSelectedVersion(formattedVersions[0])
        } else if (plugin.provider === 'modrinth') {
          const response = await fetch(`https://api.modrinth.com/v2/project/${plugin.id}/version`)
          if (!response.ok) throw new Error('Failed to fetch Modrinth versions')
          const versions = await response.json()
          
          const formattedVersions: VersionInfo[] = versions.map((v: any) => ({
            id: v.id,
            name: v.version_number,
            minecraftVersions: v.game_versions || [],
            releaseDate: new Date(v.date_published).toLocaleDateString()
          }))
          
          setVersions(formattedVersions)
          setSelectedVersion(formattedVersions[0])
        }
      } catch (err) {
        console.error('Error fetching versions:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch versions')
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [plugin.id, plugin.provider])

  useEffect(() => {
    if (selectedVersion && showActions) {
      if (isInQueue) {
        updatePluginVersion(plugin.id, selectedVersion.name, selectedVersion.minecraftVersions)
      }
    }
  }, [selectedVersion, plugin.id, isInQueue, updatePluginVersion, showActions])

  const handleAddToQueue = () => {
    if (selectedVersion) {
      if (plugin.provider === 'spigot') {
        fetch(`/api/spigot/${plugin.id.replace('spigot-', '')}/check-external`)
          .then(response => response.json())
          .then(data => {
            if (data.external) {
              setError('This plugin uses an external download link and cannot be added to the queue. Please visit the plugin page to download it manually.');
            } else {
              savePlugin(plugin, selectedVersion.name, selectedVersion.minecraftVersions);
            }
          })
          .catch(err => {
            console.error('Error checking external status:', err);
            setError('Failed to check plugin download type. Please try again.');
          });
      } else {
        savePlugin(plugin, selectedVersion.name, selectedVersion.minecraftVersions);
      }
    }
  }

  const handleRemoveFromQueue = () => {
    removePlugin(plugin.id)
  }

  return (
    <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {plugin.name}
              </h3>
              <a
                href={plugin.provider === 'spigot' 
                  ? `https://www.spigotmc.org/resources/${plugin.id.replace('spigot-', '')}`
                  : `https://modrinth.com/plugin/${plugin.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="View on original site"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {plugin.description}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {plugin.downloads.toLocaleString()} downloads
              </span>
              {plugin.provider === 'modrinth' ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/30">
                  Modrinth
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-500/30">
                  SpigotMC
                </span>
              )}
            </div>
          </div>

          {showActions && (
            <div className="flex-shrink-0">
              {isInQueue ? (
                <button
                  onClick={handleRemoveFromQueue}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  Remove
                </button>
              ) : (
                !plugin.premium ? (
                  <button
                      onClick={handleAddToQueue}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                      disabled={!selectedVersion}
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add to Queue
                  </button>
                ) : (
                  <button
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-red-700 dark:text-red-400 transition-colors"
                      disabled
                      title="This is a premium plugin and cannot be added to the queue. Please download it from the original site."
                  >
                    Premium Plugin
                  </button>
                )
            )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="mt-4 space-y-3">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
                {error}
              </p>
            )}
            <div className="relative">
              <Listbox value={selectedVersion} onChange={setSelectedVersion} disabled={loading}>
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-50 dark:bg-gray-700/50 py-2 pl-3 pr-10 text-left text-sm text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <span className="block truncate">
                    {loading ? 'Loading versions...' : selectedVersion?.name || 'Select version'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Listbox.Options className="relative z-10 mt-1 w-full overflow-visible rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/5 focus:outline-none text-sm">
                    <div className="max-h-[400px] overflow-y-auto">
                      {versions.map((version) => (
                        <Listbox.Option
                          key={version.id}
                          value={version}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                              active ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100' : 
                              'text-gray-900 dark:text-white'
                            }`
                          }
                        >
                          <div className="flex flex-col">
                            <span className="block truncate font-medium">{version.name}</span>
                            {version.minecraftVersions.length > 0 && (
                              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                MC: {version.minecraftVersions.join(', ')}
                              </span>
                            )}
                            {version.releaseDate && (
                              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                Released: {version.releaseDate}
                              </span>
                            )}
                          </div>
                        </Listbox.Option>
                      ))}
                    </div>
                  </Listbox.Options>
                </Transition>
              </Listbox>
            </div>

            {selectedVersion?.minecraftVersions.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Supported MC versions: </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedVersion.minecraftVersions.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
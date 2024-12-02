'use client'

import { useState } from 'react'
import { Download, Trash2, Package, AlertTriangle } from 'lucide-react'
import { useSavedPlugins } from '@/contexts/SavedPluginsContext'
import PluginCard from './PluginCard'
import JSZip from 'jszip'

interface PluginDownloadInfo {
  url: string
  version: string
  selectedVersion?: string
}

export function DownloadSection() {
  const { savedPlugins, removePlugin } = useSavedPlugins()
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [pluginVersions, setPluginVersions] = useState<Record<string, string>>({})

  const downloadPlugin = async (url: string) => {
    console.log('Attempting to download from URL:', url)
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || `Failed to download plugin: ${response.statusText}`)
    }

    return response.blob()
  }

  const getSpigotDownloadUrl = async (pluginId: string, version?: string) => {
    const id = pluginId.replace('spigot-', '')
    console.log('Getting Spigot download URL for plugin ID:', id, 'version:', version)
    
    try {
      if (version && version !== 'Latest') {
        // Get specific version
        const versionsResponse = await fetch(`https://api.spiget.org/v2/resources/${id}/versions?size=100&sort=-releaseDate`)
        if (!versionsResponse.ok) throw new Error('Failed to fetch versions')
        const versions = await versionsResponse.json()
        const targetVersion = versions.find((v: any) => v.name === version)
        if (!targetVersion) throw new Error(`Version ${version} not found`)
        
        // Use the specific version ID for download
        const response = await fetch(`/api/spigot/${id}/download?version=${targetVersion.id}`)
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || `Failed to get Spigot download URL: ${response.statusText}`)
        }
        const data = await response.json()
        return { url: data.downloadUrl, version: targetVersion.name }
      } else {
        // Get latest version
        const response = await fetch(`/api/spigot/${id}/download`)
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || `Failed to get Spigot download URL: ${response.statusText}`)
        }
        const data = await response.json()
        
        // Get version info
        const versionResponse = await fetch(`https://api.spiget.org/v2/resources/${id}/versions/latest`)
        if (!versionResponse.ok) throw new Error('Failed to get version info')
        const versionInfo = await versionResponse.json()
        
        return { url: data.downloadUrl, version: versionInfo.name }
      }
    } catch (error) {
      console.error('Error getting Spigot download info:', error)
      throw error
    }
  }

  const getModrinthDownloadUrl = async (pluginId: string, version?: string) => {
    console.log('Getting Modrinth download URL for plugin ID:', pluginId, 'version:', version)
    try {
      const response = await fetch(`https://api.modrinth.com/v2/project/${pluginId}/version`)
      if (!response.ok) {
        throw new Error(`Failed to get Modrinth versions: ${response.statusText}`)
      }
      const versions = await response.json()
      if (!versions.length) {
        throw new Error('No versions found for this plugin')
      }

      let targetVersion
      if (version && version !== 'Latest') {
        targetVersion = versions.find((v: any) => v.version_number === version)
        if (!targetVersion) throw new Error(`Version ${version} not found`)
      } else {
        targetVersion = versions[0] // Latest version
      }

      if (!targetVersion.files?.length) {
        throw new Error('No download files found for this version')
      }

      return { 
        url: targetVersion.files[0].url, 
        version: targetVersion.version_number 
      }
    } catch (error) {
      console.error('Error getting Modrinth download info:', error)
      throw error
    }
  }

  const getUniqueFileName = (name: string, version: unknown, provider: string, existingFiles: Set<string>): string => {
    // Clean the name and ensure version is a string
    const safeName = String(name).replace(/[^a-zA-Z0-9-_. ]/g, '')
    
    // Handle version more carefully
    let safeVersion: string
    if (version === null || version === undefined) {
      safeVersion = 'unknown'
    } else if (typeof version === 'string' || typeof version === 'number') {
      safeVersion = String(version)
    } else if (typeof version === 'object') {
      // If it's an object, stringify it but clean up the result
      safeVersion = JSON.stringify(version)
        .replace(/[{}"]/g, '') // Remove JSON syntax
        .replace(/:/g, ' ') // Replace colons with spaces
        .replace(/,/g, '-') // Replace commas with dashes
    } else {
      safeVersion = 'unknown'
    }
    
    // Clean the version string
    safeVersion = safeVersion.replace(/[^a-zA-Z0-9-_. ]/g, '')
    
    // Create base filename with version
    let fileName = `${safeName} (${safeVersion})`
    
    // If there's a conflict, add the provider
    if (existingFiles.has(fileName + '.jar')) {
      fileName = `${fileName} [${provider}]`
    }
    
    // If there's still a conflict, add a number
    let counter = 1
    let finalName = fileName
    while (existingFiles.has(finalName + '.jar')) {
      finalName = `${fileName} (${counter})`
      counter++
    }
    
    console.log('Generated filename:', {
      name: safeName,
      version: version,
      safeVersion: safeVersion,
      provider: provider,
      finalName: finalName + '.jar'
    })
    
    return finalName + '.jar'
  }

  const handleVersionChange = (pluginId: string, version: string) => {
    setPluginVersions(prev => ({
      ...prev,
      [pluginId]: version
    }))
  }

  const handleDownloadAll = async () => {
    if (savedPlugins.length === 0 || isDownloading) return

    setIsDownloading(true)
    setDownloadProgress(0)
    const zip = new JSZip()

    try {
      const pluginsFolder = zip.folder('plugins')
      if (!pluginsFolder) throw new Error('Failed to create plugins folder')

      const total = savedPlugins.length
      let completed = 0
      let failed = 0
      const existingFiles = new Set<string>()

      console.log('Starting downloads for plugins:', savedPlugins)

      await Promise.all(
        savedPlugins.map(async (plugin) => {
          try {
            console.log(`Processing plugin: ${plugin.name} (${plugin.provider})`, plugin)
            let downloadInfo: PluginDownloadInfo

            switch (plugin.provider) {
              case 'spigot':
                downloadInfo = await getSpigotDownloadUrl(plugin.id, pluginVersions[plugin.id])
                break
              case 'modrinth':
                downloadInfo = await getModrinthDownloadUrl(plugin.id, pluginVersions[plugin.id])
                break
              default:
                throw new Error(`Unsupported plugin provider: ${plugin.provider}`)
            }

            if (!downloadInfo.url) {
              throw new Error('Failed to get download URL')
            }

            console.log(`Downloading ${plugin.name} version ${downloadInfo.version} from ${downloadInfo.url}`)
            const blob = await downloadPlugin(downloadInfo.url)
            console.log(`Successfully downloaded ${plugin.name}, size: ${blob.size} bytes`)
            
            // Generate unique filename
            const fileName = getUniqueFileName(plugin.name, downloadInfo.version, plugin.provider, existingFiles)
            existingFiles.add(fileName)
            
            pluginsFolder.file(fileName, blob)
            completed++
            setDownloadProgress((completed / total) * 100)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error(`Failed to download ${plugin.name}:`, errorMessage)
            failed++
            completed++
            setDownloadProgress((completed / total) * 100)
          }
        })
      )

      if (failed === total) {
        throw new Error('All downloads failed')
      }

      console.log('Generating zip file...')
      const content = await zip.generateAsync({ type: 'blob' })
      console.log('Zip file generated, size:', content.size)
      
      const url = window.URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.download = 'plugins.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      if (failed > 0) {
        console.warn(`${failed} plugin(s) failed to download`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Download error:', errorMessage)
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="bg-dark-800/50 backdrop-blur rounded-xl p-4 ring-1 ring-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary-400" />
              <h2 className="text-lg font-medium text-white">Download Queue</h2>
              <span className="text-sm text-gray-400">
                {savedPlugins.length} plugin{savedPlugins.length !== 1 ? 's' : ''}
              </span>
            </div>
            {savedPlugins.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium ring-1 ring-primary-500/50"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Downloading... {Math.round(downloadProgress)}%</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download All</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {savedPlugins.length === 0 ? (
          <div className="bg-dark-800/50 backdrop-blur rounded-xl p-8 text-center ring-1 ring-white/5">
            <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Your download queue is empty</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Search for plugins using the search bar and add them to your queue to download them all at once.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedPlugins.map((plugin) => (
              <div key={plugin.id} className="relative">
                <PluginCard plugin={plugin} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export type PluginProvider = 'modrinth' | 'spigot' | 'manual'

export interface Plugin {
  id: string
  name: string
  description: string
  downloads: number
  provider: PluginProvider
  url: string
}

export interface SavedPlugin extends Plugin {
  savedAt: number
  version: string
  minecraftVersions: string[]
}
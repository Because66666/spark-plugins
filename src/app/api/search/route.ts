import { NextResponse } from 'next/server'
import { Plugin } from '@/types/plugin'

// Function to calculate relevancy score
function calculateRelevancy(plugin: Plugin, query: string): number {
  const searchTerms = query.toLowerCase().split(/\s+/)
  let score = 0

  // Name match (highest weight)
  searchTerms.forEach(term => {
    if (plugin.name.toLowerCase().includes(term)) {
      score += 10
      if (plugin.name.toLowerCase() === term) score += 5 // Exact match bonus
    }
  })

  // Description match
  searchTerms.forEach(term => {
    if (plugin.description.toLowerCase().includes(term)) {
      score += 3
    }
  })

  // Download count factor (logarithmic scale to prevent domination)
  score += Math.log10(plugin.downloads + 1)

  // Boost manual plugins slightly to prioritize them
  if (plugin.provider === 'manual') {
    score += 2
  }

  return score
}

async function getModrinthVersions(projectId: string): Promise<any[]> {
  try {
    const response = await fetch(`https://api.modrinth.com/v2/project/${projectId}/version`)
    const versions = await response.json()
    return versions
  } catch (error) {
    console.error('Error fetching Modrinth versions:', error)
    return []
  }
}

async function searchModrinth(query: string): Promise<Plugin[]> {
  try {
    const response = await fetch(
      `https://api.modrinth.com/v2/search?query=${encodeURIComponent(
        query
      )}&limit=10&facets=[["project_type:plugin"]]`
    )
    const data = await response.json()

    const plugins = await Promise.all(
      data.hits.map(async (hit: any) => {
        const versions = await getModrinthVersions(hit.project_id)
        return {
          id: hit.project_id,
          name: hit.title,
          description: hit.description,
          author: hit.author,
          downloads: hit.downloads,
          provider: 'modrinth',
          resourceUrl: `https://modrinth.com/plugin/${hit.slug}`,
          versions: versions.map((version: any) => ({
            version: version.version_number,
            downloadUrl: version.files[0].url,
            minecraftVersions: version.game_versions
          }))
        }
      })
    )

    return plugins
  } catch (error) {
    console.error('Error searching Modrinth:', error)
    return []
  }
}

async function getSpigotVersions(resourceId: number): Promise<any[]> {
  try {
    const response = await fetch(`https://api.spiget.org/v2/resources/${resourceId}/versions?size=20&sort=-releaseDate`)
    const versions = await response.json()
    
    const resourceResponse = await fetch(`https://api.spiget.org/v2/resources/${resourceId}`)
    const resource = await resourceResponse.json()
    const testedVersions = resource.testedVersions || []
    
    return versions.map((version: any) => ({
      version: version.name,
      downloadUrl: `https://api.spiget.org/v2/resources/${resourceId}/versions/${version.id}/download`,
      minecraftVersions: testedVersions
    }))
  } catch (error) {
    console.error('Error fetching Spigot versions:', error)
    return []
  }
}

async function searchSpigot(query: string): Promise<Plugin[]> {
  try {
    const response = await fetch(
      `https://api.spiget.org/v2/search/resources/${encodeURIComponent(query)}?size=10&sort=-downloads&fields=id,name,tag,author,testedVersions,downloads,premium`
    )
    const results = await response.json()

    const plugins = await Promise.all(
      results.map(async (result: any) => {
        try {
          const detailsResponse = await fetch(`https://api.spiget.org/v2/resources/${result.id}`)
          const details = await detailsResponse.json()
          
          const versions = await getSpigotVersions(result.id)

          return {
            id: `spigot-${result.id}`,
            name: result.name,
            description: details.tag || 'No description available',
            author: result.author.name,
            downloads: result.downloads,
            provider: 'spigot',
            resourceUrl: `https://www.spigotmc.org/resources/${result.id}`,
            versions: versions,
            premium: result.premium
          }
        } catch (error) {
          console.error(`Error processing Spigot plugin ${result.id}:`, error)
          return null
        }
      })
    )

    return plugins.filter((plugin): plugin is Plugin => plugin !== null)
  } catch (error) {
    console.error('Error searching SpigotMC:', error)
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const source = searchParams.get('source') || 'all'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    let results: Plugin[] = []

    if (source === 'all' || source === 'modrinth') {
      const modrinthResults = await searchModrinth(query)
      results = [...results, ...modrinthResults]
    }

    if (source === 'all' || source === 'spigot') {
      const spigotResults = await searchSpigot(query)
      results = [...results, ...spigotResults]
    }

    // Sort results by relevancy
    results.sort((a, b) => calculateRelevancy(b, query) - calculateRelevancy(a, query))

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search plugins' }, { status: 500 })
  }
}

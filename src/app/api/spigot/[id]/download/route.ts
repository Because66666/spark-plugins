import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/')
  const id = segments[segments.indexOf('spigot') + 1]

  try {
    if (!id || typeof id !== 'string' || id === 'download') {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    // Get the resource details first to verify it exists and get version info
    const resourceUrl = `https://api.spiget.org/v2/resources/${id}`
    const resourceResponse = await fetch(resourceUrl, {
      headers: {
        'User-Agent': 'SparkPlugins/1.0.0'
      }
    })

    if (!resourceResponse.ok) {
      const errorMessage = `Resource not found: ${resourceResponse.status} ${resourceResponse.statusText}`
      return NextResponse.json({ error: errorMessage }, { status: resourceResponse.status })
    }

    const resource = await resourceResponse.json()
    
    // Get the latest version
    const versionUrl = `https://api.spiget.org/v2/resources/${id}/versions/latest`
    const versionResponse = await fetch(versionUrl, {
      headers: {
        'User-Agent': 'SparkPlugins/1.0.0'
      }
    })

    if (!versionResponse.ok) {
      const errorMessage = `Failed to get version info: ${versionResponse.status} ${versionResponse.statusText}`
      return NextResponse.json({ error: errorMessage }, { status: versionResponse.status })
    }

    const version = await versionResponse.json()

    // If it's an external resource, return an error
    if (resource.external) {
      return NextResponse.json({ 
        error: 'This plugin uses an external download link and cannot be downloaded through the queue system.',
        external: true,
        externalUrl: resource.file.externalUrl
      }, { status: 400 })
    }

    // For internal resources, use direct download
    const downloadUrl = `https://api.spiget.org/v2/resources/${id}/download`
    return NextResponse.json({ 
      downloadUrl,
      external: false,
      version: version.name
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}

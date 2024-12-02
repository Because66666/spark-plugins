import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    console.log('Received download request for URL:', url)
    
    if (!url) {
      console.error('No URL provided')
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      )
    }

    if (typeof url !== 'string') {
      console.error('URL is not a string:', typeof url)
      return NextResponse.json(
        { error: 'URL must be a string' },
        { status: 400 }
      )
    }

    if (!url.startsWith('http')) {
      console.error('Invalid URL format:', url)
      return NextResponse.json(
        { error: 'URL must start with http or https' },
        { status: 400 }
      )
    }

    try {
      // Validate URL format
      new URL(url)
    } catch (e) {
      console.error('Invalid URL:', url, e)
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log(`Attempting to download plugin from: ${url}`)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SparkPlugins/1.0.0'
      }
    })
    
    if (!response.ok) {
      const errorMessage = `Download failed: ${response.status} ${response.statusText}`
      console.error(errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type')
    if (!contentType) {
      console.warn('No content-type header received, defaulting to application/java-archive')
    }

    const blob = await response.blob()
    if (!blob.size) {
      console.error('Received empty file')
      return NextResponse.json(
        { error: 'Received empty file' },
        { status: 400 }
      )
    }

    console.log(`Successfully downloaded plugin (${blob.size} bytes)`)
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType || 'application/java-archive',
        'Content-Disposition': `attachment; filename="plugin.jar"`,
        'Content-Length': blob.size.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

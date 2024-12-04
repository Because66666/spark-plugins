import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/')
  const id = segments[segments.indexOf('spigot') + 1]

  try {
    if (!id || typeof id !== 'string' || id === 'check-external') {
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    // Get the resource details to check if it's external
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
    
    return NextResponse.json({ 
      external: resource.external === true,
      externalUrl: resource.file?.externalUrl
    })

  } catch (error) {
    console.error('Error checking external status:', error)
    return NextResponse.json(
      { error: 'Failed to check external status' },
      { status: 500 }
    )
  }
}

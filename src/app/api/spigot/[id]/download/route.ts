import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    if (!id || typeof id !== 'string') {
      console.error('Invalid resource ID:', id)
      return NextResponse.json(
        { error: 'Invalid resource ID' },
        { status: 400 }
      )
    }

    console.log(`Fetching Spigot download URL for resource: ${id}`)
    const response = await fetch(
      `https://api.spiget.org/v2/resources/${id}/download`,
      {
        headers: {
          'User-Agent': 'SparkPlugins/1.0.0'
        },
        redirect: 'follow'
      }
    )
    
    if (!response.ok) {
      const errorMessage = `Spigot API error: ${response.status} ${response.statusText}`
      console.error(errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // The Spigot API redirects to the actual download URL
    const downloadUrl = response.url
    console.log('Received download URL from Spigot:', downloadUrl)
    
    if (!downloadUrl) {
      console.error('No download URL received from Spigot')
      return NextResponse.json(
        { error: 'No download URL received from Spigot' },
        { status: 400 }
      )
    }

    if (!downloadUrl.startsWith('http')) {
      console.error('Invalid download URL format:', downloadUrl)
      return NextResponse.json(
        { error: 'Invalid download URL received from Spigot' },
        { status: 400 }
      )
    }

    try {
      // Validate URL format
      new URL(downloadUrl)
    } catch (e) {
      console.error('Invalid URL from Spigot:', downloadUrl, e)
      return NextResponse.json(
        { error: 'Invalid URL format from Spigot' },
        { status: 400 }
      )
    }

    console.log(`Successfully retrieved download URL for resource ${id}`)
    return NextResponse.json({ downloadUrl })
  } catch (error) {
    console.error('Spigot download API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

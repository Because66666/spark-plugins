import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url, external } = await request.json()
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
      new URL(url)
    } catch (e) {
      console.error('Invalid URL:', url, e)
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log(`Attempting to download plugin from: ${url}`)
    
    const headers: Record<string, string> = {
      'User-Agent': 'SparkPlugins/1.0.0'
    }

    // If it's not an external resource, add Spiget-specific headers
    if (!external) {
      headers['Accept'] = '*/*'
      headers['Accept-Encoding'] = 'gzip, deflate, br'
      headers['Accept-Language'] = 'en-US,en;q=0.9'
      headers['Cache-Control'] = 'no-cache'
      headers['Connection'] = 'keep-alive'
      headers['DNT'] = '1'
      headers['Pragma'] = 'no-cache'
      headers['Sec-Fetch-Dest'] = 'document'
      headers['Sec-Fetch-Mode'] = 'navigate'
      headers['Sec-Fetch-Site'] = 'same-origin'
      headers['Sec-Fetch-User'] = '?1'
      headers['Upgrade-Insecure-Requests'] = '1'
    }

    const response = await fetch(url, {
      headers,
      redirect: 'follow'
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
      console.error('No content type in response')
      return NextResponse.json(
        { error: 'No content type in response' },
        { status: 400 }
      )
    }

    const data = await response.arrayBuffer()
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment'
      }
    })
  } catch (error) {
    console.error('Error downloading plugin:', error)
    return NextResponse.json(
      { error: 'Failed to download plugin' },
      { status: 500 }
    )
  }
}

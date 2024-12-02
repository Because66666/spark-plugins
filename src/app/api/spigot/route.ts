import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.spiget.org/v2/search/resources/${encodeURIComponent(query)}?size=10&sort=-downloads`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Spigot')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Spigot API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from Spigot' }, { status: 500 })
  }
}

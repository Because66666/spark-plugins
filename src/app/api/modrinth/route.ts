import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=[["project_type:plugin"]]&limit=10`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Modrinth')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Modrinth API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from Modrinth' }, { status: 500 })
  }
}

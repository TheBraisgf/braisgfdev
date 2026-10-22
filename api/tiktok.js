export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const params = new URLSearchParams({
      unique_id: 'braisgfroom',
      count: '6',
    })

    const upstream = await fetch(`https://www.tikwm.com/api/user/posts?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    if (!upstream.ok) {
      response.status(502).json({ error: 'TikTok feed provider unavailable' })
      return
    }

    const payload = await upstream.json()
    const videos = payload?.data?.videos || []

    const mapped = videos.slice(0, 6).map((video) => {
      const id = String(video.video_id || video.id || '')
      return {
        id,
        title: video.title || '',
        image: video.cover || video.origin_cover || '',
        url: video.share_url || `https://www.tiktok.com/@braisgfroom/video/${id}`,
        embedLink: id ? `https://www.tiktok.com/player/v1/${id}?controls=1&description=1&music_info=1` : '',
        platform: 'TikTok',
      }
    }).filter((video) => video.id)

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.status(200).json(mapped)
  } catch (error) {
    response.status(502).json({ error: 'Unable to load TikTok videos' })
  }
}

import type { Config } from '@netlify/functions'

const API_BASE_URL = 'https://api.restcountries.com'
const API_PATH_PREFIX = '/api/countries/v5'

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const requestUrl = new URL(request.url)
  if (
    requestUrl.pathname !== API_PATH_PREFIX &&
    !requestUrl.pathname.startsWith(`${API_PATH_PREFIX}/`)
  ) {
    return new Response('Not found', { status: 404 })
  }

  const apiPath = requestUrl.pathname.replace(/^\/api/, '')
  const upstreamUrl = `${API_BASE_URL}${apiPath}${requestUrl.search}`
  const apiKey = process.env.REST_COUNTRIES_API_KEY

  if (!apiKey) {
    return Response.json({ message: 'REST_COUNTRIES_API_KEY is not configured.' }, { status: 500 })
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    const body = await upstreamResponse.arrayBuffer()

    return new Response(body, {
      status: upstreamResponse.status,
      headers: {
        'content-type': upstreamResponse.headers.get('content-type') ?? 'application/json',
        'cache-control': 'public, max-age=300, s-maxage=300',
      },
    })
  } catch {
    return Response.json({ message: 'Country data is temporarily unavailable.' }, { status: 502 })
  }
}

export const config: Config = {
  path: '/api/*',
}

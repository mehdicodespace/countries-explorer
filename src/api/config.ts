import axios from 'axios'

export const createApiClient = (baseURL: string, timeout = 10000) => {
  const client = axios.create({
    baseURL,
    timeout,
  })

  // Log error in development for debugging
  // In production, errors are handled by the components itself (just for interceptor usage)
  if (import.meta.env.DEV) {
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(error)
        return Promise.reject(error)
      },
    )
  }

  return client
}

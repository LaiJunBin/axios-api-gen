import { METHOD } from './types'

export const getMethodByName = (name: string) => {
  for (const method in METHOD) {
    if (name.indexOf(method.toLowerCase()) === 0) {
      return method
    }
  }

  return null
}

export const replaceUrlWithRouteParams = (
  url: string,
  routeParams: Record<string, string | number>
): string => {
  for (const [k, v] of url.matchAll(/:([^/]+)/g)) {
    if (!routeParams[v]) {
      throw new Error(`Missing route param: ${v}, in url: ${url}`)
    }

    url = url.replace(k, routeParams[v] as string)
  }
  return url
}

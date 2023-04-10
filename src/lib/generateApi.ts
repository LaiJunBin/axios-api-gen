import axios from 'axios'
import { Api, Apis, AxiosConfig, METHOD, generateApiOptions } from '../types'
import { getMethodByName, replaceUrlWithRouteParams } from '../utils'

export const generateApi = <T extends object>(
  apis: T,
  options: generateApiOptions = {
    axiosInstance: axios,
  }
): Apis<T> => {
  const { axiosInstance, beforeHandler, afterHandler } = options
  const request = (method: string, path: string) => {
    return async (config: AxiosConfig = {}) => {
      const { routeParams = {}, ...restConfig } = config
      const url = replaceUrlWithRouteParams(path, routeParams)

      await beforeHandler?.()
      return axiosInstance
        ?.request({
          ...restConfig,
          method: method.toLowerCase(),
          url,
        })
        .finally(afterHandler)
    }
  }

  const requestWithMeta = (method: string, path: string) => {
    const requestInstance = request(method, path) as Api
    requestInstance.method = method as METHOD
    requestInstance.path = path
    return requestInstance
  }

  return Object.fromEntries(
    Object.entries(apis).map(([key, value]) => {
      if (value instanceof Object) {
        const { method, path } = value
        return [key, requestWithMeta(method, path)]
      } else {
        const method = getMethodByName(key)
        if (!method) {
          throw new Error(`Method not found. Key: ${key}`)
        }
        const path = value
        return [key, requestWithMeta(method, path)]
      }
    })
  ) as Apis<T>
}

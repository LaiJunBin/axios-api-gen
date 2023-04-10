import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export type ReplaceDeep<T, A, B> = {
  [K in keyof T]: T[K] extends A
    ? B
    : T[K] extends object
    ? ReplaceDeep<T[K], A, B>
    : T[K]
}

export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export type Endpoint = string | { path: string; method: METHOD }
export interface Endpoints {
  [key: string]: Endpoint
}

export type ApiMeta = {
  method: METHOD
  path: string
}

export type Api = { (config?: AxiosConfig): Promise<AxiosResponse> } & ApiMeta
export type Apis<T> = ReplaceDeep<T, Endpoint, Api>

export interface AxiosConfig extends AxiosRequestConfig {
  routeParams?: Record<string, string | number>
}

export interface generateApiOptions {
  axiosInstance?: AxiosInstance
  beforeHandler?: () => void
  afterHandler?: () => void
}

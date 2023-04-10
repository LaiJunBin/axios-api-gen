import axios from 'axios'
import { generateApi } from '..'
import endpoints from './endpoints'
import { rest } from 'mswx'
import { setupServer } from 'msw/node'
import { Api, AxiosConfig } from '../types'
import { replaceUrlWithRouteParams } from '../utils'

const handler = rest.all('*', (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(req))
})
const server = setupServer(handler)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const testApiRequest = async (
  baseURL: string,
  api: Api,
  config?: AxiosConfig
) => {
  const apiPath = replaceUrlWithRouteParams(api.path, config?.routeParams || {})
  const res = await api(config)
  const { method, url } = res.data
  expect(method).toBe(api.method)
  expect(url).toBe(`${baseURL}${apiPath}`)
  return res
}

describe('test endpoints with default axios', () => {
  const baseURL = 'http://localhost'
  const api = generateApi(endpoints)

  test('get method by name', () => {
    expect(api.getUsers.method).toBe('GET')
    expect(api.getUsers.path).toBe('/users')

    testApiRequest(baseURL, api.getUsers)
  })

  test('post method by definition', () => {
    expect(api.createUser.method).toBe('POST')
    expect(api.createUser.path).toBe('/users')

    testApiRequest(baseURL, api.createUser)
  })

  test('patch method by definition', () => {
    expect(api.updateUser.method).toBe('PATCH')
    expect(api.updateUser.path).toBe('/users/:id')

    testApiRequest(baseURL, api.updateUser, { routeParams: { id: 1 } })
  })

  test('delete method by name', () => {
    expect(api.deleteUser.method).toBe('DELETE')
    expect(api.deleteUser.path).toBe('/users/:id')

    testApiRequest(baseURL, api.deleteUser, { routeParams: { id: 1 } })
  })
})

describe('test endpoints with custom axios baseURL', () => {
  const baseURL = 'https://api.example.com'
  const axiosInstance = axios.create({
    baseURL,
  })
  const api = generateApi(endpoints, {
    axiosInstance,
  })

  test('get method by name', () => {
    expect(api.getUsers.method).toBe('GET')
    expect(api.getUsers.path).toBe('/users')

    testApiRequest(baseURL, api.getUsers)
  })

  test('post method by definition', () => {
    expect(api.createUser.method).toBe('POST')
    expect(api.createUser.path).toBe('/users')

    testApiRequest(baseURL, api.createUser)
  })

  test('patch method by definition', () => {
    expect(api.updateUser.method).toBe('PATCH')
    expect(api.updateUser.path).toBe('/users/:id')

    testApiRequest(baseURL, api.updateUser, { routeParams: { id: 1 } })
  })

  test('delete method by name', () => {
    expect(api.deleteUser.method).toBe('DELETE')
    expect(api.deleteUser.path).toBe('/users/:id')

    testApiRequest(baseURL, api.deleteUser, { routeParams: { id: 1 } })
  })
})

describe('test endpoints with custom axios baseURL and headers config', () => {
  const baseURL = 'https://api.example.com'
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'X-Test': 'test',
    },
  })
  const api = generateApi(endpoints, {
    axiosInstance,
  })

  test('get method by name', async () => {
    expect(api.getUsers.method).toBe('GET')
    expect(api.getUsers.path).toBe('/users')

    const res = await testApiRequest(baseURL, api.getUsers)
    expect(res.config.headers['X-Test']).toBe('test')
  })

  test('post method by definition', async () => {
    expect(api.createUser.method).toBe('POST')
    expect(api.createUser.path).toBe('/users')

    const res = await testApiRequest(baseURL, api.createUser)
    expect(res.config.headers['X-Test']).toBe('test')
  })

  test('patch method by definition', async () => {
    expect(api.updateUser.method).toBe('PATCH')
    expect(api.updateUser.path).toBe('/users/:id')

    const res = await testApiRequest(baseURL, api.updateUser, {
      routeParams: { id: 1 },
    })
    expect(res.config.headers['X-Test']).toBe('test')
  })

  test('delete method by name', async () => {
    expect(api.deleteUser.method).toBe('DELETE')
    expect(api.deleteUser.path).toBe('/users/:id')

    const res = await testApiRequest(baseURL, api.deleteUser, {
      routeParams: { id: 1 },
    })
    expect(res.config.headers['X-Test']).toBe('test')
  })
})

describe('test endpoints with custom axios and hooks', () => {
  const baseURL = 'https://api.example.com'
  const axiosInstance = axios.create({
    baseURL,
  })

  test('beforeHandler and afterHandler should be called', async () => {
    const beforeHandler = vi.fn()
    const afterHandler = vi.fn()

    const api = generateApi(endpoints, {
      axiosInstance,
      beforeHandler,
      afterHandler,
    })

    await testApiRequest(baseURL, api.getUsers)
    expect(beforeHandler).toBeCalled()
    expect(afterHandler).toBeCalled()
  })

  test('beforeHandler and afterHandler should be called with correct order', async () => {
    const spyRequest = vi.spyOn(axiosInstance, 'request')

    const beforeHandler = vi.fn(() => {
      expect(spyRequest).not.toBeCalled()
      expect(afterHandler).not.toBeCalled()
    })
    const afterHandler = vi.fn(() => {
      expect(spyRequest).toBeCalled()
      expect(beforeHandler).toBeCalled()
    })

    const api = generateApi(endpoints, {
      axiosInstance,
      beforeHandler,
      afterHandler,
    })

    await testApiRequest(baseURL, api.getUsers)
  })

  test('beforeHandler should async called with correct order', async () => {
    const spyRequest = vi.spyOn(axiosInstance, 'request')
    const asyncCallbackFn = vi.fn()

    const beforeHandler = vi.fn(() => {
      expect(spyRequest).not.toBeCalled()
      expect(afterHandler).not.toBeCalled()
      return new Promise((resolve) => setTimeout(resolve)).then(asyncCallbackFn)
    })
    const afterHandler = vi.fn(() => {
      expect(asyncCallbackFn).toBeCalled()
      expect(spyRequest).toBeCalled()
    })

    const api = generateApi(endpoints, {
      axiosInstance,
      beforeHandler,
      afterHandler,
    })

    await testApiRequest(baseURL, api.getUsers)
  })
})

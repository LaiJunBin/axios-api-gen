import { getMethodByName, replaceUrlWithRouteParams } from '../utils'

describe('test getMethodByName', () => {
  test('get method by name', () => {
    expect(getMethodByName('getUsers')).toBe('GET')
  })

  test('post method by name', () => {
    expect(getMethodByName('postUser')).toBe('POST')
  })

  test('put method by name', () => {
    expect(getMethodByName('putUser')).toBe('PUT')
  })

  test('patch method by name', () => {
    expect(getMethodByName('patchUser')).toBe('PATCH')
  })

  test('delete method by name', () => {
    expect(getMethodByName('deleteUser')).toBe('DELETE')
  })

  test('method not found', () => {
    expect(getMethodByName('test')).toBe(null)
  })
})

describe('test replaceUrlWithRouteParams', () => {
  test('replace one param (:id)', () => {
    expect(
      replaceUrlWithRouteParams('/users/:id', {
        id: 1,
      })
    ).toBe('/users/1')
  })

  test('replace two params (:id, :name)', () => {
    expect(
      replaceUrlWithRouteParams('/users/:id/:name', {
        id: 1,
        name: 'test',
      })
    ).toBe('/users/1/test')
  })

  test('replace two params (:id, :name) with extra params', () => {
    expect(
      replaceUrlWithRouteParams('/users/:id/:name', {
        id: 1,
        name: 'test',
        extra: 'extra',
      })
    ).toBe('/users/1/test')
  })

  test('replace two params (:id, :name) with missing params', () => {
    expect(() => {
      replaceUrlWithRouteParams('/users/:id/:name', {
        id: 1,
      })
    }).toThrowError()
  })
})

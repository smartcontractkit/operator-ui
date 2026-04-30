import { fetchWithTimeout } from './fetchWithTimeout'

const fetchMock = (global as any).fetchMock

describe('fetchWithTimeout', () => {
  it('rejects fetch requests after timeout period', () => {
    const timeoutResponse = new Promise((res) =>
      setTimeout(() => res(200), 100),
    )
    fetchMock.getOnce('/test', timeoutResponse)

    return expect(fetchWithTimeout('/test', {}, 1)).rejects.toThrow('timeout')
  })

  it('resolves fetch requests before timeout period', () => {
    const timeoutResponse = new Promise((res) => setTimeout(() => res(200), 1))
    fetchMock.getOnce('/test', timeoutResponse)

    return expect(fetchWithTimeout('/test', {}, 100)).resolves.toMatchObject({
      status: 200,
    })
  })
})

import 'mock-local-storage'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import '@testing-library/jest-dom'
import FetchMockStatic from 'fetch-mock'
import {
  fetch as undiciFetch,
  Headers as UndiciHeaders,
  Request as UndiciRequest,
  Response as UndiciResponse,
} from 'undici'

JavascriptTimeAgo.locale(en)

const fetchMock = FetchMockStatic.createInstance()

// Jest + jsdom may not provide all Fetch globals at instance creation time.
global.Headers = global.Headers || UndiciHeaders
global.Request = global.Request || UndiciRequest
global.Response = global.Response || UndiciResponse
global.fetch = global.fetch || undiciFetch

fetchMock.config.Request = global.Request
fetchMock.config.Response = global.Response
fetchMock.config.Headers = global.Headers
fetchMock.config.fetch = global.fetch
fetchMock.config.allowRelativeUrls = true
fetchMock.mockGlobal()

global.fetchMock = fetchMock

afterEach(() => {
  fetchMock.clearHistory()
  fetchMock.removeRoutes({ includeSticky: true })
  fetchMock.mockGlobal()
})

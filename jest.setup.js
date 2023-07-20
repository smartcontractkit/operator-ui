import 'mock-local-storage'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import '@testing-library/jest-dom'
import FetchMockStatic from 'fetch-mock'

JavascriptTimeAgo.locale(en)

global.fetch = FetchMockStatic.sandbox()
global.fetch.config.overwriteRoutes = true

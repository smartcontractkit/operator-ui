import 'mock-local-storage'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import '@testing-library/jest-dom'

JavascriptTimeAgo.locale(en)

// eslint-disable-next-line @typescript-eslint/no-var-requires
global.fetch = require('fetch-mock').sandbox()
global.fetch.config.overwriteRoutes = true

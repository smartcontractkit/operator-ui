/**
 * Polyfills required by undici (and fetch-mock) in the jest/jsdom environment.
 * This file is listed under `setupFiles` so it runs before any module imports.
 */
const { TextDecoder, TextEncoder } = require('util')
const { ReadableStream } = require('stream/web')
const { MessagePort } = require('worker_threads')

Object.defineProperty(global, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
})

Object.defineProperty(global, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
})

Object.defineProperty(global, 'ReadableStream', {
  writable: true,
  value: ReadableStream,
})

if (!global.MessagePort) {
  Object.defineProperty(global, 'MessagePort', {
    writable: true,
    value: MessagePort,
  })
}


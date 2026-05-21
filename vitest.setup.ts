import { enableMapSet, enablePatches } from 'immer'
import { afterEach, vi } from 'vitest'

enableMapSet()
enablePatches()

const IDBRequestMock = {
  result: null,
  error: null,
  source: null,
  transaction: null,
  readyState: 'pending',
  onsuccess: null,
  onerror: null,
  onupgradeneeded: null,
}

function createIDBRequest(result?: any) {
  const req = { result: result ?? null, onsuccess: null as (() => void) | null, onerror: null as (() => void) | null }
  setTimeout(() => req.onsuccess?.({ target: req } as any), 0)
  return req
}

function createIDBObjectStore() {
  return {
    put: vi.fn(() => createIDBRequest()),
    get: vi.fn(() => createIDBRequest(undefined)),
    getAll: vi.fn(() => createIDBRequest([])),
    getAllKeys: vi.fn(() => createIDBRequest([])),
    delete: vi.fn(() => createIDBRequest()),
    clear: vi.fn(() => createIDBRequest()),
    count: vi.fn(() => createIDBRequest(0)),
    createIndex: vi.fn(),
    index: vi.fn(() => ({
      get: vi.fn(() => createIDBRequest(undefined)),
      getAll: vi.fn(() => createIDBRequest([])),
      getAllKeys: vi.fn(() => createIDBRequest([])),
    })),
  }
}

function createIDBTransaction() {
  const store = createIDBObjectStore()
  return {
    objectStore: vi.fn(() => store),
    abort: vi.fn(),
    commit: vi.fn(),
    oncomplete: null as ((() => void) | null),
    onerror: null as ((() => void) | null),
    onabort: null as ((() => void) | null),
  }
}

const mockDB = {
  transaction: vi.fn(() => createIDBTransaction()),
  createObjectStore: vi.fn(() => createIDBObjectStore()),
  deleteObjectStore: vi.fn(),
  objectStoreNames: { contains: vi.fn(() => false) },
  close: vi.fn(),
}

const indexedDBMock = {
  open: vi.fn(() => {
    const request = { ...IDBRequestMock }
    setTimeout(() => {
      request.result = mockDB
      request.readyState = 'done'
      if (request.onupgradeneeded) request.onupgradeneeded({ target: request, oldVersion: 0 })
      if (request.onsuccess) request.onsuccess({ target: request })
    }, 0)
    return request
  }),
  deleteDatabase: vi.fn(),
}

if (typeof globalThis.indexedDB === 'undefined') {
  globalThis.indexedDB = indexedDBMock as unknown as IDBFactory
}

if (typeof globalThis.navigator !== 'undefined' && !globalThis.navigator.gpu) {
  Object.defineProperty(globalThis.navigator, 'gpu', {
    value: {
      requestAdapter: vi.fn(() => Promise.resolve(null)),
      getPreferredCanvasFormat: vi.fn(() => 'bgra8unorm'),
    },
    writable: true,
    configurable: true,
  })
}

class ResizeObserverMock {
  observe() { }
  unobserve() { }
  disconnect() { }
}
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver

class IntersectionObserverMock {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = []
  observe() { }
  unobserve() { }
  disconnect() { }
  takeRecords() { return [] }
}
globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver

class MockRTCDataChannel {
  readyState = 'open'
  send = vi.fn()
  close = vi.fn()
  onopen = null
  onclose = null
  onmessage = null
  onerror = null
}

class MockRTCPeerConnection {
  createDataChannel = vi.fn(() => new MockRTCDataChannel())
  createOffer = vi.fn(() => Promise.resolve({ type: 'offer', sdp: '' }))
  createAnswer = vi.fn(() => Promise.resolve({ type: 'answer', sdp: '' }))
  setLocalDescription = vi.fn(() => Promise.resolve())
  setRemoteDescription = vi.fn(() => Promise.resolve())
  addIceCandidate = vi.fn(() => Promise.resolve())
  close = vi.fn()
  getStats = vi.fn(() => Promise.resolve(new Map()))
  onicecandidate = null
  ondatachannel = null
  onconnectionstatechange = null
  oniceconnectionstatechange = null
}

globalThis.RTCPeerConnection = MockRTCPeerConnection as unknown as typeof RTCPeerConnection
globalThis.RTCDataChannel = MockRTCDataChannel as unknown as typeof RTCDataChannel

class MockWebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3
  readyState = MockWebSocket.CONNECTING
  url: string
  onopen: ((ev: Event) => void) | null = null
  onclose: ((ev: CloseEvent) => void) | null = null
  onmessage: ((ev: MessageEvent) => void) | null = null
  onerror: ((ev: Event) => void) | null = null
  send = vi.fn()
  close = vi.fn()
  constructor(url: string) {
    this.url = url
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN
      this.onopen?.({ type: 'open' } as Event)
    }, 0)
  }
}

globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket

class MockBroadcastChannel {
  name: string
  onmessage: ((ev: MessageEvent) => void) | null = null
  postMessage = vi.fn()
  close = vi.fn()
  constructor(name: string) { this.name = name }
}

globalThis.BroadcastChannel = MockBroadcastChannel as unknown as typeof BroadcastChannel

afterEach(() => {
  try { localStorage.clear() } catch {}
  try { sessionStorage.clear() } catch {}
})

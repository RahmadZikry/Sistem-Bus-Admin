// setupTests.ts
import '@testing-library/jest-dom'
import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Add jest-dom matchers
expect.extend(matchers)

// Stub browser globals
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)
vi.stubGlobal('confirm', vi.fn())
vi.stubGlobal('alert', vi.fn())

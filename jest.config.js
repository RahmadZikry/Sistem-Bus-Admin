import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// 🧩 Tambahkan polyfill ke global agar React Router bisa jalan di Jest
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

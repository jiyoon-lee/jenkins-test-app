// src/setupTests.js - React Scripts standard setup file
import '@testing-library/jest-dom';

// 전역 모킹 설정
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
  writable: true,
});

// 모든 테스트 후 정리
afterEach(() => {
  // 모든 모킹된 함수 초기화
  jest.clearAllMocks();
  
  // alert 모킹 초기화
  if (window.alert && jest.isMockFunction(window.alert)) {
    window.alert.mockClear();
  }
});

// React 18 StrictMode와 관련된 경고 제거
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('ReactDOMTestUtils.act')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
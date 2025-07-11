import { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 테스트 유틸리티 타입 정의
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // 추후 Provider 래퍼가 필요할 때 확장 가능
}

interface TestRenderResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>;
}

/**
 * 사용자 이벤트와 함께 컴포넌트를 렌더링하는 커스텀 렌더 함수
 * @param ui 렌더링할 React 컴포넌트
 * @param options 렌더링 옵션
 * @returns 렌더 결과와 사용자 이벤트 객체
 */
export const renderWithUserEvents = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
): TestRenderResult => {
  const user = userEvent.setup();
  const renderResult = render(ui, options);
  
  return {
    user,
    ...renderResult,
  };
};

/**
 * 기본 렌더 함수 (기존 테스트와의 호환성 유지)
 */
export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  return render(ui, options);
};

// 테스트에서 자주 사용되는 유틸리티 함수들
export const testUtils = {
  /**
   * alert 모킹 함수 설정
   */
  mockAlert: () => {
    const alertMock = jest.fn();
    window.alert = alertMock;
    return alertMock;
  },

  /**
   * console 메소드 모킹
   */
  mockConsole: (method: 'log' | 'error' | 'warn' = 'log') => {
    const consoleMock = jest.fn();
    (console as any)[method] = consoleMock;
    return consoleMock;
  },

  /**
   * 환경 변수 모킹
   */
  mockEnv: (envVars: Record<string, string>) => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, ...envVars };
    return () => {
      process.env = originalEnv;
    };
  },

  /**
   * 지연 시간을 위한 유틸리티
   */
  wait: (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Testing Library의 모든 export를 다시 export
export * from '@testing-library/react';
export { userEvent };
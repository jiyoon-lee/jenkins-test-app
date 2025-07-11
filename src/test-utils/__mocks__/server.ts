import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSW 서버 설정
export const server = setupServer(...handlers);

// 서버 유틸리티 함수들
export const serverUtils = {
  /**
   * 특정 핸들러로 일시적으로 교체
   */
  useHandlers: (...newHandlers: Parameters<typeof server.use>) => {
    server.use(...newHandlers);
  },

  /**
   * 모든 핸들러 초기화
   */
  resetHandlers: () => {
    server.resetHandlers();
  },

  /**
   * 특정 핸들러들로 완전히 교체
   */
  replaceHandlers: (...newHandlers: Parameters<typeof server.use>) => {
    server.resetHandlers(...newHandlers);
  },
};
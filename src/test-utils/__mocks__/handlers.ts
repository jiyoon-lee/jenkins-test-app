import { http, HttpResponse } from 'msw';

// API 핸들러 정의 - 현재는 가상의 API들이지만 향후 확장 가능
export const handlers = [
  // 앱 정보 API (향후 사용 가능)
  http.get('/api/app/info', () => {
    return HttpResponse.json({
      name: 'jenkins-test-app',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  }),

  // 헬스체크 API
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }),

  // 테스트 결과 제출 API (가상)
  http.post('/api/test/result', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      message: 'Jenkins CI/CD 테스트 결과가 성공적으로 제출되었습니다',
      data: body,
    });
  }),

  // 에러 시나리오 테스트용 API
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: '의도적인 테스트 에러' },
      { status: 500 }
    );
  }),

  // 인증 관련 API (향후 확장용)
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    const { username, password } = body as { username: string; password: string };
    
    if (username === 'testuser' && password === 'testpass') {
      return HttpResponse.json({
        success: true,
        user: { id: 1, username: 'testuser' },
        token: 'mock-jwt-token',
      });
    }
    
    return HttpResponse.json(
      { error: '인증 실패' },
      { status: 401 }
    );
  }),

  // 사용자 정보 API (향후 확장용)
  http.get('/api/user/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.includes('mock-jwt-token')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }
    
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'developer',
    });
  }),
];

// 특정 테스트를 위한 핸들러 오버라이드 함수들
export const errorHandlers = [
  http.get('/api/health', () => {
    return HttpResponse.json(
      { error: '서비스 일시 중단' },
      { status: 503 }
    );
  }),
];

export const slowHandlers = [
  http.get('/api/app/info', async () => {
    // 3초 지연
    await new Promise(resolve => setTimeout(resolve, 3000));
    return HttpResponse.json({
      name: 'jenkins-test-app',
      version: '1.0.0',
      environment: 'slow-test',
    });
  }),
];
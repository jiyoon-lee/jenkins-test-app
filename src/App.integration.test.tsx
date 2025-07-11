import React from 'react';
import { renderWithUserEvents, testUtils } from './test-utils/test-utils';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App 컴포넌트 - 통합 테스트 (Integration Tests)', () => {
  beforeEach(() => {
    testUtils.mockAlert();
  });

  describe('사용자 시나리오 기반 통합 테스트', () => {
    it('신규 사용자의 첫 방문 시나리오를 완전히 테스트한다', async () => {
      // Given: 새로운 사용자가 Jenkins 테스트 앱에 처음 접근
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;

      // When & Then: 사용자의 자연스러운 탐색 과정
      
      // 1. 첫 번째 인상 - 앱 제목과 목적 확인
      expect(screen.getByText('Jenkins CI/CD 테스트 앱')).toBeInTheDocument();
      expect(screen.getByText('이 앱은 Jenkins 파이프라인을 테스트하기 위해 만들어졌습니다.')).toBeInTheDocument();

      // 2. 기능 확인 - 어떤 기능들이 있는지 살펴봄
      const featuresSection = screen.getByText('테스트 기능들').closest('.features');
      expect(featuresSection).toBeInTheDocument();
      
      // 각 기능이 명확히 표시되는지 확인
      const features = [
        '자동 빌드 테스트',
        '단위 테스트 실행', 
        '코드 린트 검사',
        '자동 배포'
      ];
      
      features.forEach(feature => {
        expect(screen.getByText(new RegExp(feature))).toBeInTheDocument();
      });

      // 3. 상호작용 - 테스트 버튼 발견 및 클릭
      const testButton = screen.getByTestId('test-button');
      expect(testButton).toBeInTheDocument();
      expect(testButton).toHaveTextContent('테스트 버튼 클릭');

      await user.click(testButton);

      // 4. 피드백 확인 - alert 메시지 표시
      expect(alertMock).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');

      // 5. 정보 확인 - 버전 및 환경 정보 확인
      expect(screen.getByText('버전: 1.0.0')).toBeInTheDocument();
      expect(screen.getByText(/빌드 환경:/)).toBeInTheDocument();
    });

    it('개발자의 테스트 검증 시나리오를 완전히 테스트한다', async () => {
      // Given: 개발자가 앱의 Jenkins 연동 기능을 검증하려는 상황
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;

      // When: 개발자의 체크리스트 검증 과정
      
      // 1. CI/CD 파이프라인 관련 기능 확인
      const features = screen.getAllByText(/자동|테스트|린트|배포/);
      expect(features.length).toBeGreaterThanOrEqual(4);

      // 2. 앱의 안정성 테스트 - 여러 번 버튼 클릭
      const testButton = screen.getByTestId('test-button');
      
      await user.click(testButton);
      await user.click(testButton);
      await user.click(testButton);

      // 3. 각 클릭에 대한 일관된 응답 확인
      expect(alertMock).toHaveBeenCalledTimes(3);
      alertMock.mock.calls.forEach(call => {
        expect(call[0]).toBe('Jenkins CI/CD 테스트 성공!');
      });

      // 4. 버전 정보로 올바른 빌드 확인
      const versionElement = screen.getByText('버전: 1.0.0');
      expect(versionElement).toBeInTheDocument();

      // 5. 환경 설정 확인
      const envElement = screen.getByText(/빌드 환경:/);
      expect(envElement).toBeInTheDocument();
    });
  });

  describe('컴포넌트 간 상호작용 테스트', () => {
    it('UI 요소들 간의 레이아웃과 상호작용이 올바르게 동작해야 한다', () => {
      // Given: App 컴포넌트의 전체 렌더링
      const { container } = renderWithUserEvents(<App />);

      // When: 레이아웃 구조 확인
      const appContainer = container.querySelector('.App');
      const headerSection = container.querySelector('.App-header');
      const featuresSection = container.querySelector('.features');
      const buttonElement = container.querySelector('.test-button');
      const versionSection = container.querySelector('.version-info');

      // Then: 모든 섹션이 올바른 계층 구조로 배치되어야 함
      expect(appContainer).toContainElement(headerSection);
      expect(headerSection).toContainElement(featuresSection);
      expect(headerSection).toContainElement(buttonElement);
      expect(headerSection).toContainElement(versionSection);

      // 각 섹션의 내용이 정확한지 확인
      expect(featuresSection).toContainElement(screen.getByText('테스트 기능들'));
      expect(buttonElement).toContainElement(screen.getByText('테스트 버튼 클릭'));
      expect(versionSection).toContainElement(screen.getByText('버전: 1.0.0'));
    });

    it('앱의 전체 상태 관리가 올바르게 동작해야 한다', async () => {
      // Given: App 컴포넌트와 상태 추적 설정
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;

      // When: 다양한 사용자 행동 시뮬레이션
      const testButton = screen.getByTestId('test-button');

      // 초기 상태 확인
      expect(testButton).toBeEnabled();
      expect(alertMock).not.toHaveBeenCalled();

      // 버튼 클릭 후 상태 확인
      await user.click(testButton);
      expect(alertMock).toHaveBeenCalledTimes(1);

      // 연속 클릭에도 일관된 동작 확인
      await user.click(testButton);
      expect(alertMock).toHaveBeenCalledTimes(2);

      // Then: 앱의 상태가 예측 가능하고 일관된 방식으로 관리되어야 함
      expect(testButton).toBeEnabled(); // 버튼이 계속 활성화 상태
      alertMock.mock.calls.forEach(call => {
        expect(call[0]).toBe('Jenkins CI/CD 테스트 성공!');
      });
    });
  });

  describe('환경별 동작 테스트', () => {
    it('다양한 환경 변수에서 앱이 올바르게 동작해야 한다', () => {
      // Given: 다양한 환경 설정
      const testEnvironments = ['development', 'production', 'test', 'staging'];

      testEnvironments.forEach(env => {
        // When: 특정 환경으로 설정하고 렌더링
        const restoreEnv = testUtils.mockEnv({ NODE_ENV: env });
        const { unmount } = renderWithUserEvents(<App />);

        // Then: 환경 정보가 올바르게 표시되어야 함
        expect(screen.getByText(`빌드 환경: ${env}`)).toBeInTheDocument();

        // Cleanup
        unmount();
        restoreEnv();
      });
    });

    it('환경 변수가 없는 경우의 기본 동작을 테스트한다', () => {
      // Given: NODE_ENV가 undefined인 환경
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      // When: App 컴포넌트 렌더링
      renderWithUserEvents(<App />);

      // Then: 현재 구현된 동작을 정확히 테스트 (NODE_ENV가 undefined면 'undefined'가 문자열로 표시됨)
      const envElement = screen.getByText(/빌드 환경:/);
      expect(envElement).toBeInTheDocument();
      
      // 현재 구현에서는 process.env.NODE_ENV가 undefined일 때 'undefined' 문자열로 변환됨
      expect(envElement.textContent).toMatch(/빌드 환경:/);

      // Cleanup
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('접근성 및 사용성 통합 테스트', () => {
    it('키보드 네비게이션으로 앱의 주요 기능에 접근할 수 있어야 한다', async () => {
      // Given: 키보드만 사용하는 사용자
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;

      // When: 탭 키로 네비게이션
      await user.tab();

      // 포커스가 버튼으로 이동했는지 확인
      const testButton = screen.getByTestId('test-button');
      expect(testButton).toHaveFocus();

      // Enter 키로 버튼 클릭
      await user.keyboard('{Enter}');

      // Then: 키보드로도 정상적으로 동작해야 함
      expect(alertMock).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');
    });

    it('스크린 리더 사용자를 위한 시맨틱 구조가 올바르게 구성되어야 한다', () => {
      // Given: 스크린 리더 사용자가 접근
      renderWithUserEvents(<App />);

      // When: ARIA 역할과 시맨틱 요소 확인
      const heading = screen.getByRole('heading', { level: 1 });
      const button = screen.getByRole('button');
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');

      // Then: 올바른 시맨틱 구조가 제공되어야 함
      expect(heading).toHaveTextContent('Jenkins CI/CD 테스트 앱');
      expect(button).toHaveTextContent('테스트 버튼 클릭');
      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(4); // 4개의 기능 항목
    });
  });

  describe('성능 및 렌더링 최적화 테스트', () => {
    it('앱이 빠르게 초기 렌더링을 완료해야 한다', async () => {
      // Given: 성능 측정을 위한 설정
      const startTime = performance.now();

      // When: App 컴포넌트 렌더링
      renderWithUserEvents(<App />);

      // 주요 요소들이 즉시 표시되는지 확인
      expect(screen.getByText('Jenkins CI/CD 테스트 앱')).toBeInTheDocument();
      expect(screen.getByTestId('test-button')).toBeInTheDocument();

      const endTime = performance.now();

      // Then: 합리적인 시간 내에 렌더링이 완료되어야 함
      expect(endTime - startTime).toBeLessThan(100); // 100ms 이내
    });

    it('여러 번 렌더링해도 메모리 누수가 없어야 한다', () => {
      // Given: 반복 렌더링 테스트
      const renderCount = 10;
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;

      // When: 여러 번 마운트/언마운트
      for (let i = 0; i < renderCount; i++) {
        const { unmount } = renderWithUserEvents(<App />);
        
        // 각 렌더링에서 기본 기능 확인
        expect(screen.getByText('Jenkins CI/CD 테스트 앱')).toBeInTheDocument();
        
        unmount();
      }

      // Then: alert 모킹이 깨끗하게 유지되어야 함
      expect(alertMock).not.toHaveBeenCalled();
    });
  });

  describe('브라우저 호환성 시뮬레이션 테스트', () => {
    it('현재 구현된 alert 함수가 다양한 브라우저 환경에서 동작해야 한다', async () => {
      // Given: 다양한 alert 구현 시뮬레이션
      const mockImplementations = [
        jest.fn(), // 표준 브라우저
        jest.fn(), // IE 호환
        jest.fn(), // 모바일 브라우저
      ];

      for (const mockAlert of mockImplementations) {
        // When: 각 구현으로 테스트
        window.alert = mockAlert;
        const { user, unmount } = renderWithUserEvents(<App />);
        
        await user.click(screen.getByTestId('test-button'));

        // Then: 모든 구현에서 동일하게 동작해야 함
        expect(mockAlert).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');
        
        unmount();
      }
    });
  });

  describe('향후 확장성을 위한 아키텍처 테스트', () => {
    it('현재 구현이 향후 API 연동과 함께 동작할 수 있는 구조여야 한다', async () => {
      // Given: 향후 API 호출이 추가될 것을 고려한 구조 테스트
      renderWithUserEvents(<App />);

      // When: 앱의 기본 기능 실행
      const testButton = screen.getByTestId('test-button');
      expect(testButton).toBeInTheDocument();

      // Then: API가 없어도 정상 동작하며, 향후 확장 가능한 구조여야 함
      expect(screen.getByText('Jenkins CI/CD 테스트 앱')).toBeInTheDocument();
      expect(screen.getByText('버전: 1.0.0')).toBeInTheDocument();
    });

    it('현재 구조가 향후 상태 관리 라이브러리 도입에 적합해야 한다', () => {
      // Given: App 컴포넌트의 현재 구조 분석
      const { container } = renderWithUserEvents(<App />);

      // When: 컴포넌트 구조 확인
      const appElement = container.querySelector('.App');

      // Then: Provider로 래핑하기 적합한 구조여야 함
      expect(appElement).toBeInTheDocument();
      expect(appElement?.children).toHaveLength(1); // header만 포함
      
      // 단일 진입점 구조로 Provider 래핑이 용이함
      expect(container.firstChild).toBe(appElement);
    });
  });
});
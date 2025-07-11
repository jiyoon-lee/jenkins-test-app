import React from 'react';
import { renderWithUserEvents, testUtils } from './test-utils/test-utils';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App 컴포넌트', () => {
  beforeEach(() => {
    // 각 테스트 전에 alert 모킹 설정
    testUtils.mockAlert();
  });

  describe('기본 렌더링 검증', () => {
    it('현재 구현된 레이아웃과 콘텐츠가 정확히 표시되어야 한다', () => {
      // Given: App 컴포넌트가 렌더링 준비된 상태
      
      // When: 컴포넌트를 렌더링
      renderWithUserEvents(<App />);
      
      // Then: 현재 구현된 모든 요소들이 표시되어야 함
      expect(screen.getByText('Jenkins CI/CD 테스트 앱')).toBeInTheDocument();
      expect(screen.getByText('이 앱은 Jenkins 파이프라인을 테스트하기 위해 만들어졌습니다.')).toBeInTheDocument();
      expect(screen.getByText('테스트 기능들')).toBeInTheDocument();
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
      expect(screen.getByText('버전: 1.0.0')).toBeInTheDocument();
    });

    it('현재 구현된 헤더 영역의 구조가 올바르게 표시되어야 한다', () => {
      // Given: App 컴포넌트 렌더링
      const { container } = renderWithUserEvents(<App />);
      
      // When: DOM 구조 확인
      const appDiv = container.querySelector('.App');
      const headerDiv = container.querySelector('.App-header');
      
      // Then: 현재 구현된 CSS 클래스 구조가 존재해야 함
      expect(appDiv).toBeInTheDocument();
      expect(headerDiv).toBeInTheDocument();
      expect(headerDiv).toContainElement(screen.getByText('Jenkins CI/CD 테스트 앱'));
    });
  });

  describe('기능 리스트 표시 동작', () => {
    it('현재 구현된 4개의 기능 항목이 모두 표시되어야 한다', () => {
      // Given: App 컴포넌트가 렌더링된 상태
      renderWithUserEvents(<App />);
      
      // When: 기능 리스트 영역을 확인
      const featuresList = screen.getByText('테스트 기능들').closest('.features');
      
      // Then: 현재 구현된 4개 기능이 모두 표시되어야 함
      expect(featuresList).toBeInTheDocument();
      expect(screen.getByText(/자동 빌드 테스트/)).toBeInTheDocument();
      expect(screen.getByText(/단위 테스트 실행/)).toBeInTheDocument();
      expect(screen.getByText(/코드 린트 검사/)).toBeInTheDocument();
      expect(screen.getByText(/자동 배포/)).toBeInTheDocument();
    });

    it('현재 구현된 기능 리스트의 마크업 구조가 정확해야 한다', () => {
      // Given: App 컴포넌트 렌더링
      const { container } = renderWithUserEvents(<App />);
      
      // When: 기능 리스트 DOM 구조 확인
      const featuresDiv = container.querySelector('.features');
      const featuresList = featuresDiv?.querySelector('ul');
      const listItems = featuresList?.querySelectorAll('li');
      
      // Then: 현재 구현된 HTML 구조가 정확해야 함
      expect(featuresDiv).toBeInTheDocument();
      expect(featuresList).toBeInTheDocument();
      expect(listItems).toHaveLength(4);
    });
  });

  describe('테스트 버튼 인터랙션', () => {
    it('현재 구현된 버튼 클릭 시 alert 동작이 정확히 실행되어야 한다', async () => {
      // Given: App 컴포넌트가 렌더링되고 alert이 모킹된 상태
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;
      const testButton = screen.getByTestId('test-button');
      
      // When: 테스트 버튼을 클릭
      await user.click(testButton);
      
      // Then: 현재 구현된 alert 메시지가 정확히 호출되어야 함
      expect(alertMock).toHaveBeenCalledTimes(1);
      expect(alertMock).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');
    });

    it('현재 구현된 버튼의 속성과 텍스트가 정확해야 한다', () => {
      // Given: App 컴포넌트 렌더링
      renderWithUserEvents(<App />);
      
      // When: 테스트 버튼 확인
      const testButton = screen.getByTestId('test-button');
      
      // Then: 현재 구현된 버튼 속성들이 정확해야 함
      expect(testButton).toHaveTextContent('테스트 버튼 클릭');
      expect(testButton).toHaveClass('test-button');
      expect(testButton.tagName).toBe('BUTTON');
    });

    it('현재 구현된 버튼 클릭 이벤트 핸들러가 정상 동작해야 한다', async () => {
      // Given: App 컴포넌트와 사용자 이벤트 설정
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;
      
      // When: 버튼을 여러 번 클릭
      const testButton = screen.getByTestId('test-button');
      await user.click(testButton);
      await user.click(testButton);
      
      // Then: 각 클릭마다 alert이 호출되어야 함 (현재 동작)
      expect(alertMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('버전 정보 표시', () => {
    it('현재 구현된 버전 정보가 정확히 표시되어야 한다', () => {
      // Given: App 컴포넌트 렌더링
      renderWithUserEvents(<App />);
      
      // When: 버전 정보 영역 확인
      const versionInfo = screen.getByText('버전: 1.0.0');
      
      // Then: 현재 하드코딩된 버전 정보가 표시되어야 함
      expect(versionInfo).toBeInTheDocument();
    });

    it('현재 구현된 환경 정보 표시 동작을 테스트한다', () => {
      // Given: 환경 변수가 설정된 상태에서 App 컴포넌트 렌더링
      const restoreEnv = testUtils.mockEnv({ NODE_ENV: 'test' });
      renderWithUserEvents(<App />);
      
      // When: 환경 정보 텍스트 확인
      const envInfo = screen.getByText(/빌드 환경:/);
      
      // Then: 현재 구현된 환경 정보 표시 로직이 동작해야 함
      expect(envInfo).toHaveTextContent('빌드 환경: test');
      
      // Cleanup
      restoreEnv();
    });

    it('현재 구현된 버전 정보 영역의 CSS 클래스가 정확해야 한다', () => {
      // Given: App 컴포넌트 렌더링
      const { container } = renderWithUserEvents(<App />);
      
      // When: 버전 정보 영역 DOM 확인
      const versionDiv = container.querySelector('.version-info');
      
      // Then: 현재 구현된 CSS 클래스가 적용되어야 함
      expect(versionDiv).toBeInTheDocument();
      expect(versionDiv).toContainElement(screen.getByText('버전: 1.0.0'));
    });
  });

  describe('통합 테스트 - 전체 앱 동작', () => {
    it('사용자가 앱을 처음 방문했을 때의 전체 경험을 테스트한다', async () => {
      // Given: 새로운 사용자가 앱에 접근하는 상황
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;
      
      // When: 사용자가 앱의 주요 요소들을 확인하고 버튼을 클릭
      // 1. 제목 확인
      expect(screen.getByText('Jenkins CI/CD 테스트 앱')).toBeVisible();
      
      // 2. 설명 확인
      expect(screen.getByText(/Jenkins 파이프라인을 테스트하기 위해/)).toBeVisible();
      
      // 3. 기능 리스트 확인
      expect(screen.getByText('테스트 기능들')).toBeVisible();
      
      // 4. 버튼 클릭
      await user.click(screen.getByTestId('test-button'));
      
      // 5. 버전 정보 확인
      expect(screen.getByText('버전: 1.0.0')).toBeVisible();
      
      // Then: 모든 요소가 정상적으로 표시되고 동작해야 함
      expect(alertMock).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');
    });

    it('앱의 모든 UI 요소가 접근 가능한 상태로 렌더링되어야 한다', () => {
      // Given: 접근성을 고려한 사용자가 앱에 접근
      renderWithUserEvents(<App />);
      
      // When: 주요 UI 요소들의 접근성 확인
      const heading = screen.getByRole('heading', { name: /Jenkins CI\/CD 테스트 앱/i });
      const button = screen.getByRole('button', { name: /테스트 버튼 클릭/i });
      const list = screen.getByRole('list');
      
      // Then: 현재 구현된 접근성 수준이 유지되어야 함
      expect(heading).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('현재 구현된 앱 구조가 반응형으로 렌더링되어야 한다', () => {
      // Given: App 컴포넌트가 렌더링된 상태
      const { container } = renderWithUserEvents(<App />);
      
      // When: 앱의 전체 구조 확인
      const appContainer = container.querySelector('.App');
      const headerSection = container.querySelector('.App-header');
      const featuresSection = container.querySelector('.features');
      const versionSection = container.querySelector('.version-info');
      
      // Then: 현재 구현된 모든 섹션이 존재해야 함
      expect(appContainer).toBeInTheDocument();
      expect(headerSection).toBeInTheDocument();
      expect(featuresSection).toBeInTheDocument();
      expect(versionSection).toBeInTheDocument();
    });
  });

  describe('에러 처리 및 엣지 케이스', () => {
    it('현재 구현된 컴포넌트가 React.StrictMode에서도 정상 동작해야 한다', () => {
      // Given: React.StrictMode로 래핑된 App 컴포넌트
      renderWithUserEvents(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      // When: 기본 기능 확인
      const title = screen.getByText('Jenkins CI/CD 테스트 앱');
      const button = screen.getByTestId('test-button');
      
      // Then: StrictMode에서도 정상 렌더링되어야 함
      expect(title).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('현재 구현된 handleButtonClick 함수의 동작을 정확히 문서화한다', async () => {
      // Given: App 컴포넌트와 사용자 이벤트 설정
      const { user } = renderWithUserEvents(<App />);
      const alertMock = window.alert as jest.MockedFunction<typeof window.alert>;
      
      // When: 버튼 클릭 함수의 현재 구현 테스트
      const testButton = screen.getByTestId('test-button');
      
      // 현재 구현: alert 메시지만 표시하고 다른 부수 효과 없음
      await user.click(testButton);
      
      // Then: 현재 동작을 정확히 문서화
      expect(alertMock).toHaveBeenCalledTimes(1);
      expect(alertMock).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');
      
      // 현재 구현에서는 버튼 상태 변화나 다른 UI 업데이트 없음
      expect(testButton).toHaveTextContent('테스트 버튼 클릭'); // 텍스트 변화 없음
      expect(testButton).not.toBeDisabled(); // 비활성화되지 않음
    });
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// 기본 렌더링 테스트
test('앱이 정상적으로 렌더링되는지 확인', () => {
  render(<App />);
  const linkElement = screen.getByText(/Jenkins CI\/CD 테스트 앱/i);
  expect(linkElement).toBeInTheDocument();
});

// 제목 텍스트 확인
test('제목이 올바르게 표시되는지 확인', () => {
  render(<App />);
  const title = screen.getByText('Jenkins CI/CD 테스트 앱');
  expect(title).toBeInTheDocument();
});

// 버튼 클릭 테스트
test('테스트 버튼이 존재하는지 확인', () => {
  render(<App />);
  const testButton = screen.getByTestId('test-button');
  expect(testButton).toBeInTheDocument();
});

// 버튼 클릭 이벤트 테스트
test('버튼 클릭 시 alert가 호출되는지 확인', () => {
  // alert 모킹
  window.alert = jest.fn();
  
  render(<App />);
  const testButton = screen.getByTestId('test-button');
  
  fireEvent.click(testButton);
  
  expect(window.alert).toHaveBeenCalledWith('Jenkins CI/CD 테스트 성공!');
});

// 기능 리스트 확인 (부분 텍스트 매칭으로 수정)
test('기능 리스트가 올바르게 표시되는지 확인', () => {
  render(<App />);
  
  // 부분 텍스트 매칭 사용
  expect(screen.getByText(/자동 빌드/)).toBeInTheDocument();
  expect(screen.getByText(/단위 테스트/)).toBeInTheDocument();
  expect(screen.getByText(/코드 린트/)).toBeInTheDocument();
  expect(screen.getByText(/자동 배포/)).toBeInTheDocument();
});

// 버전 정보 확인
test('버전 정보가 표시되는지 확인', () => {
  render(<App />);
  const versionInfo = screen.getByText('버전: 1.0.0');
  expect(versionInfo).toBeInTheDocument();
});
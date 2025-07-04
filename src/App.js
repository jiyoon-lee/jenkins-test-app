import React from 'react';
import './App.css';

function App() {
  const handleButtonClick = () => {
    alert('Jenkins CI/CD 테스트 성공!');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jenkins CI/CD 테스트 앱</h1>
        <p>이 앱은 Jenkins 파이프라인을 테스트하기 위해 만들어졌습니다.</p>
        
        <div className="features">
          <h2>테스트 기능들</h2>
          <ul>
            <li>✅ 자동 빌드 테스트</li>
            <li>✅ 단위 테스트 실행</li>
            <li>✅ 코드 린트 검사</li>
            <li>✅ 자동 배포</li>
          </ul>
        </div>

        <button 
          className="test-button"
          onClick={handleButtonClick}
          data-testid="test-button"
        >
          테스트 버튼 클릭
        </button>

        <div className="version-info">
          <p>버전: 1.0.0</p>
          <p>빌드 환경: {process.env.NODE_ENV}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
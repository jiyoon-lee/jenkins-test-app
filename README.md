# Jenkins 테스트 앱 🚀

Jenkins CI/CD 파이프라인을 테스트하기 위한 간단한 React 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 다음과 같은 Jenkins CI/CD 기능들을 테스트할 수 있습니다:

- ✅ 자동 빌드
- ✅ 단위 테스트 실행
- ✅ 코드 린트 검사
- ✅ 코드 커버리지 리포트
- ✅ Docker 이미지 빌드
- ✅ 브랜치별 자동 배포

## 🧪 테스트 전략

### 포괄적인 테스트 커버리지
- **34개 테스트** 케이스로 100% 코드 커버리지 달성
- **통합 테스트 중심** (45% 비중)의 테스트 트로피 모델 적용
- **사용자 중심 테스트** - 실제 사용자 워크플로우 검증
- **현재 동작 문서화** - 소스코드 수정 없이 기존 동작 정확히 테스트

### 테스트 구조
```
src/
├── test-utils/           # 공통 테스트 유틸리티
├── App.test.js          # 기존 테스트 (6개)
├── App.enhanced.test.tsx # 향상된 단위/통합 테스트 (15개)
├── App.integration.test.tsx # 사용자 시나리오 통합 테스트 (13개)
└── setupTests.js        # Jest 설정
```

### 주요 테스트 특징
- **한국어 테스트 설명** - 명확한 의도 전달
- **AAA 패턴** (Arrange-Act-Assert) + **Given-When-Then** 구조
- **접근성 테스트** - 스크린 리더, 키보드 네비게이션 검증
- **성능 테스트** - 렌더링 속도, 메모리 누수 방지
- **브라우저 호환성** - 다양한 환경에서의 동작 검증

## 🛠️ 설치 및 실행

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 테스트 실행 (커버리지 포함)
npm test

# 특정 테스트 파일 실행
npm test -- --testPathPattern="App.enhanced.test.tsx"

# 빌드
npm run build

# 린트 검사
npm run lint
```

### Docker 실행

```bash
# Docker 이미지 빌드
docker build -t jenkins-test-app .

# 컨테이너 실행
docker run -p 3000:3000 jenkins-test-app
```

## 🔧 Jenkins 설정

### 1. 필수 플러그인
- NodeJS Plugin
- Docker Plugin
- HTML Publisher Plugin
- Pipeline Plugin

### 2. 파이프라인 설정
1. Jenkins에서 새 Pipeline 프로젝트 생성
2. Pipeline script from SCM 선택
3. Git 저장소 URL 입력
4. Branch 설정 (*/main, */develop)
5. Script Path: `Jenkinsfile`

### 3. 브랜치별 배포 전략
- `main/master` → Production 환경
- `develop` → Staging 환경
- `feature/*` → Development 환경

## 📊 테스트 커버리지

### 현재 달성도
```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |     100 |      100 |     100 |     100 |
 App.js   |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|
```

### 테스트 종류별 구성
- **사용자 시나리오 테스트**: 신규 사용자 첫 방문, 개발자 검증 플로우
- **UI 컴포넌트 테스트**: 모든 요소의 정확한 렌더링 및 상호작용
- **접근성 테스트**: ARIA 역할, 키보드 네비게이션, 스크린 리더 지원
- **성능 테스트**: 초기 렌더링 속도, 메모리 누수 방지
- **환경별 테스트**: 다양한 NODE_ENV 설정에서의 동작 검증

### 테스트 명명 규칙
```typescript
describe('App 컴포넌트', () => {
  it('현재 구현된 버튼 클릭 시 alert 동작이 정확히 실행되어야 한다', async () => {
    // Given: App 컴포넌트가 렌더링되고 alert이 모킹된 상태
    // When: 테스트 버튼을 클릭
    // Then: 현재 구현된 alert 메시지가 정확히 호출되어야 함
  });
});
```

## 🚀 배포 환경

### Staging
- 브랜치: `develop`
- 자동 배포: ✅
- 테스트 환경용

### Production
- 브랜치: `main`
- 자동 배포: ✅
- 실제 서비스 환경

## 📝 사용법

1. 이 저장소를 Fork 또는 Clone
2. Jenkins에서 Pipeline 프로젝트 생성
3. Git 저장소 연결
4. 코드 변경 후 Push
5. Jenkins에서 자동 빌드 및 배포 확인

## 🔍 모니터링

Jenkins Pipeline 실행 시 다음 항목들을 모니터링할 수 있습니다:

- 빌드 시간
- 테스트 통과율 (현재 100%)
- 코드 커버리지 (현재 100%)
- 린트 에러 수
- 배포 상태

## 📚 추가 문서

- [상세 테스트 문서](./TESTING.md) - 테스트 전략, 패턴, 실행 방법
- [Jenkinsfile](./Jenkinsfile) - CI/CD 파이프라인 설정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **테스트 작성** - 새 기능에 대한 테스트 추가
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5. **테스트 실행** - `npm test`로 모든 테스트 통과 확인
6. Push to the Branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### 테스트 작성 가이드라인
- 기존 동작을 변경하지 마세요
- 새 기능에 대한 테스트를 먼저 작성하세요
- 한국어로 테스트 설명을 작성하세요
- Given-When-Then 패턴을 따르세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

문제가 있거나 도움이 필요하시면 이슈를 생성해주세요.

---
**Happy Testing! 🧪✨**
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

## 🛠️ 설치 및 실행

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 테스트 실행
npm test

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

프로젝트에는 다음과 같은 테스트가 포함되어 있습니다:

- 컴포넌트 렌더링 테스트
- 사용자 인터랙션 테스트
- 기능 검증 테스트
- 스냅샷 테스트

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
- 테스트 통과율
- 코드 커버리지
- 린트 에러 수
- 배포 상태

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

문제가 있거나 도움이 필요하시면 이슈를 생성해주세요.

---
**Happy Coding! 🎉**
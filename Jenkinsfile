pipeline {
    agent any
    
    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Git 저장소에서 코드 체크아웃'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '🛠️ Node.js 환경 설정'
                sh '''
                    echo "Node.js 버전 확인:"
                    node --version
                    npm --version
                    echo "Node.js 경로: $(which node)"
                    echo "npm 경로: $(which npm)"
                    echo "현재 작업 디렉토리: $(pwd)"
                    ls -la
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 의존성 설치 중...'
                sh '''
                    echo "package.json 확인:"
                    cat package.json
                    echo "npm install 실행:"
                    npm install
                '''
            }
        }
        
        stage('Lint') {
            steps {
                echo '🔍 코드 린트 검사 중...'
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh 'npm run lint'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 단위 테스트 실행 중...'
                sh '''
                    echo "테스트 실행:"
                    npm test -- --coverage --watchAll=false --testResultsProcessor=jest-junit
                '''
            }
            post {
                always {
                    script {
                        // JUnit 테스트 결과 발행
                        if (fileExists('junit.xml')) {
                            junit 'junit.xml'
                            echo "✅ JUnit 테스트 결과 발행 완료"
                        } else {
                            echo "⚠️ junit.xml 파일이 없습니다."
                        }
                        
                        // 코드 커버리지 리포트 발행
                        if (fileExists('coverage/lcov-report/index.html')) {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                            echo "✅ 커버리지 리포트 발행 완료"
                        } else {
                            echo "⚠️ 커버리지 리포트를 찾을 수 없습니다."
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo '🏗️ 프로덕션 빌드 중...'
                sh '''
                    echo "빌드 시작:"
                    npm run build
                    echo "빌드 완료 - 결과 확인:"
                    ls -la build/
                '''
            }
        }
        
        stage('Archive Build') {
            steps {
                echo '📁 빌드 결과물 아카이브'
                script {
                    if (fileExists('build')) {
                        archiveArtifacts artifacts: 'build/**/*', allowEmptyArchive: true
                        echo "✅ 빌드 결과물 아카이브 완료"
                    } else {
                        echo "⚠️ build 디렉토리를 찾을 수 없습니다."
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo '🚀 Staging 환경에 배포 중...'
                sh '''
                    echo "=== Staging 배포 시뮬레이션 ==="
                    echo "빌드 번호: ${BUILD_NUMBER}"
                    echo "브랜치: ${BRANCH_NAME}"
                    echo "커밋: ${GIT_COMMIT}"
                    echo "빌드 URL: ${BUILD_URL}"
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo '🌟 Production 환경에 배포 중...'
                sh '''
                    echo "=== Production 배포 시뮬레이션 ==="
                    echo "빌드 번호: ${BUILD_NUMBER}"
                    echo "브랜치: ${BRANCH_NAME}"
                    echo "커밋: ${GIT_COMMIT}"
                    echo "빌드 URL: ${BUILD_URL}"
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Pipeline 완료 - 정리 작업 중...'
            script {
                echo "워크스페이스 내용:"
                sh 'ls -la'
                if (fileExists('coverage')) {
                    sh 'ls -la coverage/'
                }
            }
        }
        success {
            echo '✅ Pipeline 성공!'
            script {
                def message = """
                ✅ 빌드 성공!
                프로젝트: ${env.JOB_NAME}
                빌드 번호: ${env.BUILD_NUMBER}
                브랜치: ${env.BRANCH_NAME ?: 'main'}
                커밋: ${env.GIT_COMMIT?.take(7)}
                빌드 URL: ${env.BUILD_URL}
                """
                echo message
            }
        }
        failure {
            echo '❌ Pipeline 실패!'
            script {
                def message = """
                ❌ 빌드 실패!
                프로젝트: ${env.JOB_NAME}
                빌드 번호: ${env.BUILD_NUMBER}
                브랜치: ${env.BRANCH_NAME ?: 'main'}
                실패 단계: ${env.STAGE_NAME}
                빌드 URL: ${env.BUILD_URL}
                """
                echo message
            }
        }
    }
}
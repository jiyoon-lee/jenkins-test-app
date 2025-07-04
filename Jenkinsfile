pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        CI = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Git 저장소에서 코드 체크아웃'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo 'Node.js 환경 설정'
                // Jenkins NodeJS 플러그인 사용 시
                // nodejs(nodeJSInstallationName: 'NodeJS-18') {
                    sh 'node --version'
                    sh 'npm --version'
                // }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '의존성 설치 중...'
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                echo '코드 린트 검사 중...'
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                echo '단위 테스트 실행 중...'
                sh 'npm run test:ci'
            }
            post {
                always {
                    // 테스트 결과 보고서 발행
                    publishTestResults testResultsPattern: 'junit.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                echo '프로덕션 빌드 중...'
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Docker 이미지 빌드 중...'
                script {
                    def dockerImage = docker.build("jenkins-test-app:${env.BUILD_NUMBER}")
                    dockerImage.tag("latest")
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Staging 환경에 배포 중...'
                sh '''
                    echo "Staging 배포 시뮬레이션"
                    echo "빌드 번호: ${BUILD_NUMBER}"
                    echo "브랜치: ${BRANCH_NAME}"
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
                echo 'Production 환경에 배포 중...'
                sh '''
                    echo "Production 배포 시뮬레이션"
                    echo "빌드 번호: ${BUILD_NUMBER}"
                    echo "브랜치: ${BRANCH_NAME}"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline 완료 - 정리 작업 중...'
            cleanWs()
        }
        success {
            echo '✅ Pipeline 성공!'
            // Slack 알림 (플러그인 설치 후 사용)
            // slackSend channel: '#dev-team',
            //          color: 'good',
            //          message: "✅ Build 성공: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
        failure {
            echo '❌ Pipeline 실패!'
            // Slack 알림 (플러그인 설치 후 사용)
            // slackSend channel: '#dev-team',
            //          color: 'danger',
            //          message: "❌ Build 실패: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
    }
}
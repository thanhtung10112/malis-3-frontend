pipeline {
    agent any
    stages {
        stage("Build start notify") {
            steps {
                withCredentials(
                    [
                        string(credentialsId: 'malis3-slack-bot-webhook-url', variable: 'SLACK_WEBHOOK_URL'),
                    ]
                ) {
                    // mattermostSend(endpoint: "${NOTIFIER_WEBHOOK_LINK}", channel: '#drever-devops', color:"#2389d7", message: "Build Started - ${currentBuild.fullDisplayName} (<${currentBuild.absoluteUrl}|Open>)")
                    slackSend(baseUrl: "${SLACK_WEBHOOK_URL}", tokenCredentialId: "malis3-slack-bot-webhook-url-token", color:"#2389d7", message: "Build started for deploying develop branch to QA server. Follow the link below to view the details of the build:\n<${currentBuild.absoluteUrl}|${currentBuild.fullDisplayName}>")
                }
            }
        }
        stage("Building and publishing image for QA") {
            when {
                branch "develop"
            }
            steps {
                echo "Building and publishing develop docker image"
                build job:"../Branch tools/develop - Build and publish image"
            }
        }
        stage("Update QA server with the new build") {
            when {
                branch "develop"
            }
            steps {
                echo "Update QA server with the new build"
                build job:"../Environment tools/QA Server - Update and Restart"
                echo "Wait 15 seconds before starting the health check"
                sleep time: 15, unit: "SECONDS"
            }
        }
        stage("Health check on QA server") {
            when {
                branch "develop"
            }
            steps {
                echo "Starting health check on QA server"
                build job:"../Environment tools/QA Server - Health Check"
            }
        }
    }
    post {
        always {
            echo "Job done."
        }
        success{
            script {
                if (env.GIT_PREVIOUS_SUCCESSFUL_COMMIT == null) {
                    CHANGELOGS = sh(returnStdout: true, script: "git log --first-parent --format=\"- %B\" ${GIT_COMMIT} | sed '/^\\s*\$/d'")
                } else {
                    CHANGELOGS = sh(returnStdout: true, script: "git log --first-parent --format=\"- %B\" ${GIT_PREVIOUS_SUCCESSFUL_COMMIT}..${GIT_COMMIT} | sed '/^\\s*\$/d'")
                }
                MESSAGE_ATTACHMENT = [
                    [
                        mrkdwn_in: ["text","value"],
                        title: "${currentBuild.fullDisplayName}",
                        title_link: "${currentBuild.absoluteUrl}",
                        text: "QA server build success. Malis3 frontend is now ready.",
                        color:"#00ff00",
                        fields: [
                            [
                                title: "Latest commit",
                                value: GIT_COMMIT,
                                short: false
                            ],
                            [
                                title: "Changes from last build",
                                value: CHANGELOGS
                            ]
                        ]
                    ]
                ]
            }
            withCredentials(
                [
                    string(credentialsId: 'malis3-slack-bot-webhook-url', variable: 'SLACK_WEBHOOK_URL'),
                ]
            ) {
                slackSend(baseUrl: "${SLACK_WEBHOOK_URL}", tokenCredentialId: "malis3-slack-bot-webhook-url-token", color: "#00ff00", attachments: MESSAGE_ATTACHMENT)            
            }
        }
        failure{
            withCredentials(
                [
                    string(credentialsId: 'malis3-slack-bot-webhook-url', variable: 'SLACK_WEBHOOK_URL'),
                ]
            ) {
                slackSend(baseUrl: "${SLACK_WEBHOOK_URL}", tokenCredentialId: "malis3-slack-bot-webhook-url-token", color: "#ff0000", message: "@here QA Server build failed. Please contact the dev for further investigation.\nFollow the link below to view the details of the build:\n<${currentBuild.absoluteUrl}|${currentBuild.fullDisplayName}>.")
            }
        }
    }
}


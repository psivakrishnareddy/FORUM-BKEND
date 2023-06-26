#!/usr/bin/env groovy

DOCKER_REGISTRY_URI = "https://us.icr.io"	
LOWER_DOCKER_IMAGE = "us.icr.io/sbsd-lower/sbsd-dashboard-forum-services"	
PRD_DOCKER_IMAGE = "us.icr.io/sbsd-prod/sbsd-dashboard-forum-services"	
HOTFIX_DOCKER_IMAGE = "us.icr.io/sbsd-hotfix/sbsd-dashboard-forum-services"

// SLACK_CHANNEL = "#ci_sbsd_operations"
// SLACK_COLOR_WAIT = "#f4e242"
// SLACK_COLOR_APPROVED = "#222875"
// SLACK_COLOR_SUCCESS = "#43cc12"
// SLACK_COLOR_FAIL= "#ff0000"


NON_PROD_WEBHOOK_URL = "https://presidio.webhook.office.com/webhookb2/c980af73-3c44-40d7-8258-65480e799d24@7f7268a4-7179-4a42-9837-40255b1c21e5/IncomingWebhook/98d4fd6c3e13419e979a59127fcc9d09/efd14465-8a45-4522-8fc7-1256f08395c2"
PROD_WEBHOOK_URL = "https://presidio.webhook.office.com/webhookb2/c980af73-3c44-40d7-8258-65480e799d24@7f7268a4-7179-4a42-9837-40255b1c21e5/IncomingWebhook/ad99f9af281342d7a40cf68f73527342/efd14465-8a45-4522-8fc7-1256f08395c2"

Boolean qa_stage_exists = false

if(env.BRANCH_NAME == 'development') {
    stage('DEV Build') {
        node('docker') {
            step([$class: 'WsCleanup'])
            checkout scm
            withCredentials([[$class: 'UsernamePasswordMultiBinding',
                            credentialsId: 'codaglobal-container-services',
                            usernameVariable: 'USERNAME',
                            passwordVariable: 'PASSWORD']]) {
                withEnv(["DOCKER_IMAGE=${LOWER_DOCKER_IMAGE}",
                        "DOCKER_REGISTRY_URI=${DOCKER_REGISTRY_URI}"]) {
                    sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                    sh 'docker build --pull -t ${DOCKER_IMAGE}:dev --build-arg configuration_file=dev .'
                    sh 'docker push ${DOCKER_IMAGE}:dev'
                }
            }
        }
    }
   //deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'Build successful in Dev',
        status: 'Success' 

    stage('DEV Deploy') {
        node('sbsd-dev-swarm') {
            step([$class: 'WsCleanup'])
            checkout scm
            docker.withRegistry(DOCKER_REGISTRY_URI, 'codaglobal-container-services') {
                sh 'docker stack deploy --with-registry-auth -c dev-docker-compose.yml sbsd-dev'
            }
            step([$class: 'WsCleanup'])
        }
    }
}
//deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'Deployment successful in Dev',
        status: 'Success' 


//QA
if(env.BRANCH_NAME == 'qa' || env.BRANCH_NAME == 'qa-test') {

    stage('QA Build') {
        node('docker') {
            step([$class: 'WsCleanup'])
            checkout scm
            withCredentials([[$class: 'UsernamePasswordMultiBinding',
                            credentialsId: 'codaglobal-container-services',
                            usernameVariable: 'USERNAME',
                            passwordVariable: 'PASSWORD']]) {
                withEnv(["DOCKER_IMAGE=${LOWER_DOCKER_IMAGE}",
                        "DOCKER_REGISTRY_URI=${DOCKER_REGISTRY_URI}"]) {
                    sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                    sh 'docker build --pull -t ${DOCKER_IMAGE}:qa --build-arg configuration_file=qa .'
                    sh 'docker push ${DOCKER_IMAGE}:qa'
                }
            }
        }
    }

//deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'Build successful in QA',
        status: 'Success'


    stage('QA Deploy') {
        qa_stage_exists = true

        node('sbsd-dev-swarm') {
            step([$class: 'WsCleanup'])
            checkout scm
            docker.withRegistry(DOCKER_REGISTRY_URI, 'codaglobal-container-services') {
                def sbsd_dkr_img = docker.image("${LOWER_DOCKER_IMAGE}:qa")
                sbsd_dkr_img.pull()
                sbsd_dkr_img.push('qa')
                sh 'docker stack deploy --with-registry-auth -c qa-docker-compose.yml sbsd-qa'
            }
            step([$class: 'WsCleanup'])
        }
//deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'Deployment successful in QA',
        status: 'Success' 
    }
}


//UAT or test
if(env.BRANCH_NAME == 'UAT' || env.BRANCH_NAME == 'test') {

    stage('UAT Build') {
        node('docker') {
            step([$class: 'WsCleanup'])
            checkout scm
            withCredentials([[$class: 'UsernamePasswordMultiBinding',
                            credentialsId: 'codaglobal-container-services',
                            usernameVariable: 'USERNAME',
                            passwordVariable: 'PASSWORD']]) {
                withEnv(["DOCKER_IMAGE=${LOWER_DOCKER_IMAGE}",
                        "DOCKER_REGISTRY_URI=${DOCKER_REGISTRY_URI}"]) {
                    sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                    sh 'docker build --pull -t ${DOCKER_IMAGE}:uat --build-arg configuration_file=uat .'
                    sh 'docker push ${DOCKER_IMAGE}:uat'
                }
            }
        }
    }
    //deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'Build successful in UAT',
        status: 'Success'

    stage('UAT Deploy') {
        try {
            node('docker') {
                step([$class: 'WsCleanup'])
                checkout scm
                docker.withRegistry(DOCKER_REGISTRY_URI, 'codaglobal-container-services') {
                    def sbsd_dkr_img = docker.image(
                                        "${LOWER_DOCKER_IMAGE}:uat")
                    sbsd_dkr_img.pull()
                    sbsd_dkr_img.push("uat-${env.BUILD_NUMBER}")
                }
                step([$class: 'WsCleanup'])
            }
        } catch(error) {
             //deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'UAT deployment failed in the current build',
        status: 'Build Failed'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_FAIL,
            //         message: "SBSD UAT deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")
            throw error 
        }
//deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'UAT deployment for the current build is waiting for approval',
        status: 'Waiting for approval'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_WAIT,
        //         message: "SBSD UAT deployment via build #${env.BUILD_NUMBER} for '${env.JOB_NAME}' is waiting for approval")
        

        try {
            milestone()
            def userInput = input(message: 'Deploy to UAT?',
                                submitter: env.SBSD_UAT_DEPLOYERS,
                                submitterParameter: 'approver_id')
            milestone()

             //deploy in teams

        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'UAT deployment started for the current build',
        status: 'Build started'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_APPROVED,
            //         message: "SBSD UAT deployment via build #${env.BUILD_NUMBER} started for '${env.JOB_NAME}' by '${userInput}'")


            try {
                lock(resource: 'uat-agent', inversePrecedence: true) {
                    node('sbsd-dev-swarm') {
                        step([$class: 'WsCleanup'])
                        checkout scm
                        docker.withRegistry(DOCKER_REGISTRY_URI,
                                            'codaglobal-container-services') {
                            def sbsd_dkr_img = docker.image(
                                    "${LOWER_DOCKER_IMAGE}:uat-${env.BUILD_NUMBER}")
                            sbsd_dkr_img.pull()
                            sbsd_dkr_img.push('uat')
                            sh 'docker stack deploy --with-registry-auth -c uat-docker-compose.yml sbsd-uat'
                        }
                        step([$class: 'WsCleanup'])
                    }
                }
            } catch(error) {
                //deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'UAT deployment failed in the current build',
        status: 'Build Failed'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD UAT deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")

                throw error
            }

        } catch(error) {
            def user = error.getCauses()[0].getUser()
            if('SYSTEM' == user.toString()) {
                echo "BUILD FAILED: rejected by the SYSTEM user, probably by a superseded build"
            } else {
                //deploy in teams
        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'UAT deployment aborted for the current build',
        status: 'Aborted'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD UAT deployment via build #${env.BUILD_NUMBER} aborted for '${env.JOB_NAME}' by "+user.getId())
            }
            throw error
        }

      //deploy in teams

        office365ConnectorSend webhookUrl: "${NON_PROD_WEBHOOK_URL}",
        message: 'UAT deployment completed for the current build',
        status: 'Completed'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_SUCCESS,
        //         message: "SBSD UAT deployment via build #${env.BUILD_NUMBER} completed for '${env.JOB_NAME}'")
    }
}

// Hotfix support - BEGIN
if(env.BRANCH_NAME == 'hotfix' ) {

    stage('UAT HOTFIX Build') {
        node('docker') {
            step([$class: 'WsCleanup'])
            checkout scm
            withCredentials([[$class: 'UsernamePasswordMultiBinding',
                            credentialsId: 'codaglobal-container-services',
                            usernameVariable: 'USERNAME',
                            passwordVariable: 'PASSWORD']]) {
                withEnv(["DOCKER_IMAGE=${HOTFIX_DOCKER_IMAGE}",
                        "DOCKER_REGISTRY_URI=${DOCKER_REGISTRY_URI}"]) {
                    sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'
                    sh 'docker build --pull -t ${DOCKER_IMAGE}:hotfix-uat .'
                    sh 'docker push ${DOCKER_IMAGE}:hotfix-uat'
                }
            }
        }
    }

   //deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment build started for the current build',
        status: 'Build started'
    stage('UAT HOTFIX Deploy') {
        try {
            node('docker') {
                step([$class: 'WsCleanup'])
                checkout scm
                docker.withRegistry(DOCKER_REGISTRY_URI, 'codaglobal-container-services') {
                    def sbsd_dkr_img = docker.image(
                                        "${HOTFIX_DOCKER_IMAGE}:hotfix-uat")
                    sbsd_dkr_img.pull()
                    sbsd_dkr_img.push("hotfix-uat-${env.BUILD_NUMBER}")
                }
                step([$class: 'WsCleanup'])
            }
        } catch(error) {

             //deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment failed in the current build',
        status: 'Build Failed'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_FAIL,
            //         message: "SBSD UAT HOTFIX deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")
            throw error
        }

       //deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment failed in the current build is waiting for approval',
        status: 'Waiting for approval'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_WAIT,
        //         message: "SBSD UAT HOTFIX deployment via build #${env.BUILD_NUMBER} for '${env.JOB_NAME}' is waiting for approval")

        try {
            milestone()
            def userInput = input(message: 'Deploy HOTFIX to UAT?',
                                submitter: env.SBSD_UAT_DEPLOYERS,
                                submitterParameter: 'approver_id')
            milestone()
            //deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment started for the current build',
        status: 'Build started'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_APPROVED,
            //         message: "SBSD UAT HOTFIX deployment via build #${env.BUILD_NUMBER} started for '${env.JOB_NAME}' by '${userInput}'")

            try {
                lock(resource: 'uat-agent', inversePrecedence: true) {
                    node('sbsd-dev-swarm') {
                        step([$class: 'WsCleanup'])
                        checkout scm
                        docker.withRegistry(DOCKER_REGISTRY_URI,
                                            'codaglobal-container-services') {
                            def sbsd_dkr_img = docker.image(
                                    "${HOTFIX_DOCKER_IMAGE}:hotfix-uat-${env.BUILD_NUMBER}")
                            sbsd_dkr_img.pull()
                            sbsd_dkr_img.push('hotfix-uat')
                            sh 'sed -i \'s/us.icr.io\\/sbsd-lower\\/sbsd-dashboard-forum-ui:/us.icr.io\\/sbsd-hotfix\\/sbsd-dashboard-forum-ui:hotfix-/g\' uat-docker-compose.yml'
                            sh 'cat uat-docker-compose.yml'
                            sh 'docker stack deploy --with-registry-auth -c uat-docker-compose.yml sbsd-uat'
                        }
                        step([$class: 'WsCleanup'])
                    }
                }
            } catch(error) {

                  //deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment failed in the current build',
        status: 'Build Failed'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD UAT HOTFIX deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")
                throw error
            }
        } catch(error) {
            def user = error.getCauses()[0].getUser()
            if('SYSTEM' == user.toString()) {
                echo "BUILD FAILED: rejected by the SYSTEM user, probably by a superseded build"
            } else {

                 //deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment aborted in the current build',
        status: 'Build aborted'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD UAT HOTFIX deployment via build #${env.BUILD_NUMBER} aborted for '${env.JOB_NAME}' by "+user.getId())
            }
            throw error
        }

//deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'UAT hotfix deployment completed in the current build',
        status: 'Completed'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_SUCCESS,
        //         message: "SBSD UAT HOTFIX deployment via build #${env.BUILD_NUMBER} completed for '${env.JOB_NAME}'")
    }
    stage('Prod HOTFIX Deploy') {
        try {
            node('docker') {
                step([$class: 'WsCleanup'])
                checkout scm
                docker.withRegistry(DOCKER_REGISTRY_URI, 'codaglobal-container-services') {
                    def sbsd_dkr_img = docker.image(
                                        "${HOTFIX_DOCKER_IMAGE}:hotfix-uat")
                    sbsd_dkr_img.pull()
                    sbsd_dkr_img.push("hotfix-prd-${env.BUILD_NUMBER}")
                }
                step([$class: 'WsCleanup'])
            }
        } catch(error) {

            //deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Hotfix prod deployment failed in the current build',
        status: 'Build Failed'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_FAIL,
            //         message: "SBSD HOTFIX Prod deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")
            throw error
        }

//deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Hotfix prod deployment failed for the current build is waiting for approval',
        status: 'Waiting for approval'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_WAIT,
        //         message: "SBSD HOTFIX Prod deployment via build #${env.BUILD_NUMBER} for '${env.JOB_NAME}' is waiting for approval")


        try {
            milestone()
            def userInput = input(message: 'Deploy to Prod?',
                                submitter: env.SBSD_PRD_DEPLOYERS,
                                submitterParameter: 'approver_id')
            milestone()
            //deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Hotfix prod deployment started for the current build',
        status: 'Build started'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_APPROVED,
            //         message: "SBSD HOTFIX Prod deployment via build #${env.BUILD_NUMBER} started for '${env.JOB_NAME}' by '${userInput}'")

            try {
                lock(resource: 'prod-agent', inversePrecedence: true) {
                    node('sbsd-prd-swarm') {
                        step([$class: 'WsCleanup'])
                        checkout scm
                        docker.withRegistry(DOCKER_REGISTRY_URI,
                                            'codaglobal-container-services') {
                            def sbsd_dkr_img = docker.image(
                                    "${HOTFIX_DOCKER_IMAGE}:hotfix-prd-${env.BUILD_NUMBER}")
                            sbsd_dkr_img.pull()
                            sbsd_dkr_img.push('hotfix-prd')
                            sh 'sed -i \'s/us.icr.io\\/sbsd-prod\\/sbsd-dashboard-forum-ui:/us.icr.io\\/sbsd-hotfix\\/sbsd-dashboard-forum-ui:hotfix-/g\' prd-docker-compose.yml'
                            sh 'cat prd-docker-compose.yml'
                            sh 'docker stack deploy --with-registry-auth -c prd-docker-compose.yml sbsd-prd'
                        }
                        step([$class: 'WsCleanup'])
                    }
                }
            } catch(error) {
                //deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Hotfix prod deployment failed in the current build',
        status: 'Build Failed'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD HOTFIX Prod deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")
                throw error
            }
        } catch(error) {
            def user = error.getCauses()[0].getUser()
            if('SYSTEM' == user.toString()) {
                echo "BUILD FAILED: rejected by the SYSTEM user, probably by a superseded build"
            } else {//deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Hotfix prod deployment aborted for the current build',
        status: 'Build aborted'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD HOTFIX Prod deployment via build #${env.BUILD_NUMBER} aborted for '${env.JOB_NAME}' by "+user.getId())
            }
            throw error
        }
//deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Hotfix prod deployment completed for the current build',
        status: 'Completed'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_SUCCESS,
        //         message: "SBSD HOTFIX Prod deployment via build #${env.BUILD_NUMBER} completed for '${env.JOB_NAME}'")
    }
}
// Hotfix support - END


if(env.BRANCH_NAME == 'master') {
    stage('Prod Deploy') {
        try {
            node('docker') {
                step([$class: 'WsCleanup'])
                checkout scm
                withCredentials([[$class: 'UsernamePasswordMultiBinding',		
                                credentialsId: 'codaglobal-container-services',		
                                usernameVariable: 'USERNAME',		
                                passwordVariable: 'PASSWORD']]) {		
                    withEnv(["LOWER_DOCKER_IMAGE=${LOWER_DOCKER_IMAGE}",		
                            "PRD_DOCKER_IMAGE=${PRD_DOCKER_IMAGE}",		
                            "DOCKER_REGISTRY_URI=${DOCKER_REGISTRY_URI}",		
                            "BUILD_NUMBER=${env.BUILD_NUMBER}"]) {		
                        sh 'docker login --password=${PASSWORD} --username=${USERNAME} ${DOCKER_REGISTRY_URI}'		
                        sh 'docker pull ${LOWER_DOCKER_IMAGE}:uat'		
                        sh 'docker tag ${LOWER_DOCKER_IMAGE}:uat ${PRD_DOCKER_IMAGE}:prd-${BUILD_NUMBER}'		
                        sh 'docker push ${PRD_DOCKER_IMAGE}:prd-${BUILD_NUMBER}'		
                    }	
                }
                step([$class: 'WsCleanup'])
            }
        } catch(error) {
//deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Prod deployment failed in the current build',
        status: 'Build Failed'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_FAIL,
            //         message: "SBSD Prod deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")
            throw error
        }
 //deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Prod deployment failed is waiting for approval for the current build',
        status: 'Waiting for approval'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_WAIT,
        //         message: "SBSD Prod deployment via build #${env.BUILD_NUMBER} for '${env.JOB_NAME}' is waiting for approval")

        try {
            milestone()
            def userInput = input(message: 'Deploy to Prod?',
                                submitter: env.SBSD_PRD_DEPLOYERS,
                                submitterParameter: 'approver_id')
            milestone()
//deploy in teams

        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Prod deployment started for the current build',
        status: 'Build started'
            // slackSend (botUser: true, channel: SLACK_CHANNEL,
            //         color: SLACK_COLOR_APPROVED,
            //         message: "SBSD Prod deployment via build #${env.BUILD_NUMBER} started for '${env.JOB_NAME}' by '${userInput}'")

            try {
                lock(resource: 'prod-agent', inversePrecedence: true) {
                    node('sbsd-prd-swarm') {
                        step([$class: 'WsCleanup'])
                        checkout scm
                        docker.withRegistry(DOCKER_REGISTRY_URI,
                                            'codaglobal-container-services') {
                            def sbsd_dkr_img = docker.image(
                                    "${PRD_DOCKER_IMAGE}:prd-${env.BUILD_NUMBER}")
                            sbsd_dkr_img.pull()
                            sbsd_dkr_img.push('prd')
                            sh 'docker stack deploy --with-registry-auth -c prd-docker-compose.yml sbsd-prd'
                        }
                        step([$class: 'WsCleanup'])
                    }
                }
            } catch(error) {
                //deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Prod deployment failed for the current build',
        status: 'Build failed'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD Prod deployment via build #${env.BUILD_NUMBER} failed for '${env.JOB_NAME}'")

                throw error
            }
        } catch(error) {
            def user = error.getCauses()[0].getUser()
            if('SYSTEM' == user.toString()) {
                echo "BUILD FAILED: rejected by the SYSTEM user, probably by a superseded build"
            } else {
//deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Prod deployment aborted for the current build',
        status: 'Build aborted'
                // slackSend (botUser: true, channel: SLACK_CHANNEL,
                //         color: SLACK_COLOR_FAIL,
                //         message: "SBSD Prod deployment via build #${env.BUILD_NUMBER} aborted for '${env.JOB_NAME}' by "+user.getId())
            }
            throw error
        }
 //deploy in teams
        office365ConnectorSend webhookUrl: "${PROD_WEBHOOK_URL}",
        message: 'Prod deployment completed for the current build',
        status: 'Build completed'
        // slackSend (botUser: true, channel: SLACK_CHANNEL,
        //         color: SLACK_COLOR_SUCCESS,
        //         message: "SBSD Prod deployment via build #${env.BUILD_NUMBER} completed for '${env.JOB_NAME}'")
    }
}

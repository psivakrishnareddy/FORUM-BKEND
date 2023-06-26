#!/bin/bash

secrets_base_dir="/run/secrets"

echo "Executing entrypoint scripts..."

# Function checks for the existence of the secrets file for specified secrets
# If one is not found the script will sleep and check again in an endless loop
check_secrets() {
    local secret
    local secret_exists
    local sleep_cycle=10

    for secret in "$@"; do
        echo "Checking for secret: ${secret}"
        secret_exists="false"
        while [ "${secret_exists}" == "false" ]; do
            if [ ! -e "${secrets_base_dir}/${secret}" ]; then
                echo "ERROR: Secret '${secret}' is unavailable. Unable proceed"
                echo "Will sleep for ${sleep_cycle} secs and check again"
                sleep ${sleep_cycle}
                continue
            else
                secret_exists="true"
            fi
        done
    done
}

# The db password, Sendgrid API key and JWT token key are available as Docker secrets
if [ ! -z ${USE_DOCKER_SECRETS+x} ] && [ "${USE_DOCKER_SECRETS}" == "true" ]; then
    echo "Using Docker secrets. Checking if all required secrets are available. This does not validate the secrets themselves"
    check_secrets "${SBSD_ENV}_dash_forum_db_password" "${SBSD_ENV}_jwt_token_secret_key" "${SBSD_ENV}_jwt_token_secret_key_for_upload" "${SBSD_ENV}_cert_app_sendgrid_api_key" "${SBSD_ENV}_cert_app_googleanalytics_tracking_id" "newrelic_license_id" "slack_webhook_url_secret" "cert_app_cert" "cert_app_csr" "cert_app_key"
    DB_PASSWORD=$(cat ${secrets_base_dir}/${SBSD_ENV}_dash_forum_db_password)
    JWT_TOKEN_SECRET_KEY=$(cat ${secrets_base_dir}/${SBSD_ENV}_jwt_token_secret_key)
    JWT_TOKEN_SECRET_KEY_FOR_UPLOAD=$(cat ${secrets_base_dir}/${SBSD_ENV}_jwt_token_secret_key_for_upload)
    SENDGRID_API_KEY=$(cat ${secrets_base_dir}/${SBSD_ENV}_cert_app_sendgrid_api_key)
    GOOGLE_ANALYTICS_TRACKING_ID=$(cat ${secrets_base_dir}/${SBSD_ENV}_cert_app_googleanalytics_tracking_id)
    BOX_CLIENT_ID=$(cat ${secrets_base_dir}/${SBSD_ENV}_box_client_id)
    BOX_CLIENT_SECRET=$(cat ${secrets_base_dir}/${SBSD_ENV}_box_client_secret)
    BOX_PUBLIC_KEY_ID=$(cat ${secrets_base_dir}/${SBSD_ENV}_box_public_key_id)
    BOX_PRIVATE_KEY=$(cat ${secrets_base_dir}/${SBSD_ENV}_box_private_key)
    BOX_PASSPHRASE=$(cat ${secrets_base_dir}/${SBSD_ENV}_box_passphrase)
    BOX_ENTERPRISE_ID=$(cat ${secrets_base_dir}/${SBSD_ENV}_box_enterprise_id)
    NEWRELIC_LICENSE_ID=$(cat ${secrets_base_dir}/newrelic_license_id)
    SLACK_WEBHOOK_URL_SECRET=$(cat ${secrets_base_dir}/slack_webhook_url_secret)
    export DB_PASSWORD JWT_TOKEN_SECRET_KEY JWT_TOKEN_SECRET_KEY_FOR_UPLOAD SENDGRID_API_KEY GOOGLE_ANALYTICS_TRACKING_ID BOX_CLIENT_ID BOX_CLIENT_SECRET BOX_PUBLIC_KEY_ID BOX_PRIVATE_KEY BOX_PASSPHRASE BOX_ENTERPRISE_ID NEWRELIC_LICENSE_ID SLACK_WEBHOOK_URL_SECRET

    jq '.boxAppSettings.clientID=env.BOX_CLIENT_ID' /usr/src/app/config/boxConfig.json >> tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
    jq '.boxAppSettings.clientSecret=env.BOX_CLIENT_SECRET' /usr/src/app/config/boxConfig.json >> tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
    jq '.boxAppSettings.appAuth.publicKeyID=env.BOX_PUBLIC_KEY_ID' /usr/src/app/config/boxConfig.json >> tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
    jq '.boxAppSettings.appAuth.privateKey=env.BOX_PRIVATE_KEY' /usr/src/app/config/boxConfig.json >> tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
    jq '.boxAppSettings.appAuth.passphrase=env.BOX_PASSPHRASE' /usr/src/app/config/boxConfig.json >> tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
    jq '.enterpriseID=env.BOX_ENTERPRISE_ID' /usr/src/app/config/boxConfig.json >> tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
    
    # The SSL cert, key and csr requestare available as Docker secrets and are themselves base64 encoded
    mkdir /usr/src/app/server/keys
    cat "${secrets_base_dir}/cert_app_cert" | base64 -d > /usr/src/app/server/keys/cert.pem
    cat "${secrets_base_dir}/cert_app_csr" | base64 -d > /usr/src/app/server/keys/csr.pem
    cat "${secrets_base_dir}/cert_app_key" | base64 -d > /usr/src/app/server/keys/key.pem
    
    cat /usr/src/app/config/boxConfig.json | sed 's,\\\\n,\\n,g' > tmp.json && mv tmp.json /usr/src/app/config/boxConfig.json
else
    echo "Not using Docker secrets"
fi
export NODE_OPTIONS="--max_old_space_size=${NODE_OPTIONS}"
echo "NODE CONFIG ${NODE_OPTIONS}"
echo "Newrelic configurations to detect environment"
sed -i "s/ENVIRONMENT_NAME/${NEWRELIC_ENV}/g" "/usr/src/app/newrelic.js"
sed -i "s/NEWRELIC_LICENSE_ID/${NEWRELIC_LICENSE_ID}/g" "/usr/src/app/newrelic.js"

# Updating secrets in maestro container utils script
sed -i "s/SLACK_WEBHOOK_URL_SECRET/${SLACK_WEBHOOK_URL_SECRET}/g" "/container_files/maestro_container_utils.sh"



echo "Addition of db2dsdriver.cfg"
cp -p /container_files/db2dsdriver.cfg /usr/src/app/node_modules/ibm_db/installer/clidriver/cfg/
FILE=/usr/src/app/node_modules/ibm_db/installer/clidriver/cfg/db2dsdriver.cfg

echo "Adjustment of db2dsdriver.cfg with Environment Variable Values for the DB"
FILE=/usr/src/app/node_modules/ibm_db/installer/clidriver/cfg/db2dsdriver.cfg
sed -i "s/DBNAME/${DB}/g" $FILE
sed -i "s/DB_HOSTNAME/${DB_HOSTNAME}/g" $FILE
sed -i "s/DB_PORT/${DB_PORT}/g" $FILE
sed -i "s/DB_USERNAME/${DB_USERNAME}/g" $FILE
sed -i "s/DB_PASSWORD/${DB_PASSWORD}/g" $FILE
sed -i "s/DB_SCHEMA/${DB_SCHEMA}/g" $FILE

# echo "Run of db2profile to apply changes"
# cd /usr/src/app/node_modules/ibm_db/installer/clidriver && source db2profile

# echo "Run of db2cli validate to ensure proper results"
# cd /usr/src/app/node_modules/ibm_db/installer/clidriver/bin && ./db2cli validate -dsn certappDB -connect

echo "Sending Env variables to temp file for posterior checking"
env > /tmp/env_vars.out


echo "Done executing entrypoint scripts..."

# Run the passed in command
exec "$@"


#!/bin/sh
set -e
set -u
set -o pipefail
#set -x 

check_internet_connectivity() {
    if ping -q -c 1 -W 1 8.8.8.8 &>/dev/null; then
        echo "Internet connection is up"
    else
        echo "Internet connection is down"
        exit 1
    fi
}

check_public_dns_resolution() {
    if nslookup www.google.com &>/dev/null; then
        echo "DNS check succeeded"
    else
        echo "DNS check failure"
        return 1
    fi
}


post_to_slack() {
  # format message as a code block ```${msg}```
  
  if [ "$#" -gt 0 ]; then RAW_MESSAGE="$1"; else RAW_MESSAGE=""; fi
  if [ "$#" -gt 1 ]; then SLACK_LEVEL="$2"; else SLACK_LEVEL="INFO"; fi
  local alert_slack_channel=${CG_SLACK_CHANNEL_ALERTS:-}
  if [ -z "${alert_slack_channel}" ]; then echo "WARNING: CG_SLACK_CHANNEL_ALERTS not set, so can't send slack message"; return 0; fi
  local alert_slack_webhook=${CG_SLACK_WEBHOOK_URL:-}
  if [ -z "${alert_slack_webhook}" ]; then echo "WARNING: CG_SLACK_WEBHOOK_URL not set, so can't send slack message"; return 0; fi
  local alert_level_val=${CG_SLACK_ALERTS_LEVEL:-}
  if [ -z "${alert_level_val}" ]; then echo "WARNING: CG_SLACK_ALERTS_LEVEL not set, so not sending alerts"; return 0; fi
  
  
  
case "$CG_SLACK_ALERTS_LEVEL" in 
    ERROR)
    if [ "$SLACK_LEVEL" == "INFO" ] || [ "$SLACK_LEVEL" == "WARNING" ]; then echo "$SLACK_LEVEL level slack alert will not be sent when CG_SLACK_ALERTS_LEVEL set to $CG_SLACK_ALERTS_LEVEL"; exit 0;fi
    ;;
    DEBUG)
    
    ;;
    TRACE)
    
    ;;
    INFO)
    
    ;;
esac
  
  
  MESSAGE_PREFIX=""
  case "$SLACK_LEVEL" in
    INFO)
      SLACK_ICON=':palm_tree:'
      MESSAGE_PREFIX="INFO:"
      ;;
    WARNING)
      SLACK_ICON=':zap::interrobang:'
      MESSAGE_PREFIX="WARNING:"
      ;;
    ERROR)
      SLACK_ICON=':boom::bangbang::skull_and_crossbones:'
      MESSAGE_PREFIX="ERROR:"
      ;;
    *)
      SLACK_ICON=':slack:'
      ;;
  esac
 
  SLACK_MESSAGE="\`\`\`$MESSAGE_PREFIX $1\`\`\`"
  local response=`curl -s -X POST --data-urlencode 'payload={ "channel": "'"${CG_SLACK_CHANNEL_ALERTS}"'", "text": "'"$SLACK_ICON $MESSAGE_PREFIX $SLACK_MESSAGE"'"}' ${CG_SLACK_WEBHOOK_URL}`
  echo $response
}


assertEquals()
{
    if [ "$#" -gt 2 ]; then  
        msg=$1; shift
        expected=$1; shift
        actual=$1; shift
    else
        exit 1
    fi
    if [ "$expected" != "$actual" ]; then
        echo "TEST FAILED: $msg EXPECTED=$expected ACTUAL=$actual"
        exit 2
    else 
        echo "TEST SUCCEEDED: $msg"
    fi
}




_failIfEnvVarNotSet() {
    
    printenv $1 > /dev/null || (echo "FAILED Variable missing, exiting .." && exit 1)
}

check_env_variables_exist() { 
    for consulenvvar in `echo "$1"`
    do
        _failIfEnvVarNotSet $consulenvvar || exit 1
    done
    echo "All required env variables are available ..."

}


test_post_to_slack() {

    local response=`post_to_slack "This thing, did that, if you're interested." "INFO"`
    assertEquals "No variables set test" "WARNING: CG_SLACK_CHANNEL_ALERTS not set, so can't send slack message" "$response"
    CG_SLACK_CHANNEL_ALERTS=@dom
    local response=`post_to_slack "This thing, did that, if you're interested." "INFO"`
    assertEquals "Only channel set" "WARNING: CG_SLACK_WEBHOOK_URL not set, so can't send slack message" "$response"
    local response=`post_to_slack "This thing, did that, if you're interested." "INFO"`
    assertEquals "Only channel and webhook set test" "WARNING: CG_SLACK_WEBHOOK_URL not set, so can't send slack message" "$response"
    CG_SLACK_CHANNEL_ALERTS=@dom
    CG_SLACK_WEBHOOK_URL='SLACK_WEBHOOK_URL_SECRET'
    local response=`post_to_slack "This thing, did that, if you're interested." "INFO"`
    assertEquals "No CG_SLACK_ALERTS_LEVEL set test" "WARNING: CG_SLACK_ALERTS_LEVEL not set, so not sending alerts" "$response"
    CG_SLACK_ALERTS_LEVEL=INFO
    local response=`post_to_slack "This thing, did that, if you're interested." "INFO"`
    assertEquals "INFO Slack message test" "ok" "$response"
    local response=`post_to_slack "Hmm, something is amiss." "WARNING"`
    assertEquals "WARNING Slack message test" "ok" "$response"    
    local response=`post_to_slack " something didn't work, and needs to be fixed" "ERROR"`
    assertEquals "ERROR Slack message test" "ok" "$response"
    local response=`post_to_slack "Just the default"`
    assertEquals "DEFAULT Slack message test" "ok" "$response"
    CG_SLACK_ALERTS_LEVEL=ERROR
    local response=`post_to_slack "This thing, did that, if you're interested." "INFO"`
    assertEquals "INFO Slack message test, when level is error" "INFO level slack alert will not be sent when CG_SLACK_ALERTS_LEVEL set to ERROR" "$response"
    local response=`post_to_slack "Hmm, something is amiss." "WARNING"`
    assertEquals "WARNING Slack message test, when level is error" "WARNING level slack alert will not be sent when CG_SLACK_ALERTS_LEVEL set to ERROR" "$response"    
    local response=`post_to_slack " something didn't work, and needs to be fixed" "ERROR"`
    assertEquals "ERROR Slack message test, when level is error" "ok" "$response"
    local response=`post_to_slack "Just the default"`
    assertEquals "DEFAULT Slack message test, when level is error" "INFO level slack alert will not be sent when CG_SLACK_ALERTS_LEVEL set to ERROR" "$response"
    
    
    
}


test_check_internet_connectivity() {
    local response=`check_internet_connectivity`
    assertEquals "Internet connectivity test" "Internet connection is up" "$response"
    
}

test_check_env_variables_exist() {
    export ATEST=abc; export ANOTHER=def; export ANDTHIS="ghi jklmno"
    
    local response=`check_env_variables_exist "ATEST ANOTHER ANDTHIS"`
    assertEquals "Environment variables available" "All required env variables are available ..." "$response"
    local response=`check_env_variables_exist "ATEST"`
    assertEquals "Environment variable available" "All required env variables are available ..." "$response"
    local response=`check_env_variables_exist "ATEST ANOTHER ANDTHIS NOTHERE"`
    assertEquals "Environment variables one missing" "FAILED Variable missing, exiting .." "$response"
    unset ATEST; unset ANOTHER; unset ANDTHIS
}

test_all() {
    test_post_to_slack
    test_check_internet_connectivity
    test_check_env_variables_exist
}



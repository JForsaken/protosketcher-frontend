#!/bin/bash
#
## include parse_yaml function
. $(dirname "$0")/parse_yaml.sh

set -o errexit # Exit on error

# read yaml file
eval $(parse_yaml secrets.yml "config_")

ftp -n -v -p $config_HOST << EOT
ascii
user $config_USERNAME $config_PASSWD
prompt
cd assets
put dist/app.js app.js
bye
EOT

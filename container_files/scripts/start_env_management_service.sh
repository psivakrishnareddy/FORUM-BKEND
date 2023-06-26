#!/bin/sh

source /maestro_container_utils.sh
check_internet_connectivity
if ! check_public_dns_resolution; then 
    echo 'Adding in nameserver manually to resolv conf, to get around docker dns issue.  '; 
    echo "https://github.com/docker/docker/issues/28188"
    echo 'nameserver 8.8.8.8' >> /etc/resolv.conf; 
fi
sleep 10
if ! check_public_dns_resolution; then exit 1; fi

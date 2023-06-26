FROM node:18.12.1 

RUN apt-get update && apt-get install -y net-tools

# Adding zip file OS package and Jq
RUN apt-get update && apt-get install --no-install-recommends zip procps jq -y && rm -rf /var/lib/apt/lists/*

#create the app directory
RUN mkdir -p /usr/src/app

#copy all the folders and files to app folder
COPY ./config/* usr/src/app/config/
COPY ./constants/* usr/src/app/constants/
COPY ./errors/* usr/src/app/errors/
COPY ./filters/* usr/src/app/filters/
COPY ./handlers/* usr/src/app/handlers/
COPY ./interfaces/* usr/src/app/interfaces/
COPY ./models/ usr/src/app/models/
COPY ./routes/* usr/src/app/routes/
COPY ./server/ usr/src/app/server/
COPY ./util/* usr/src/app/util/

COPY ./container_files/scripts/entrypoint.sh /container_files/entrypoint.sh 
#directly copying into container_files

COPY server.js usr/src/app/server.js
COPY package.json usr/src/app/package.json

#Copy newrelic config file, DB2 ODBC driver and other required scripts
COPY container_files/configs/newrelic.js /usr/src/app/newrelic.js
COPY container_files/configs/db2dsdriver.cfg /container_files/
COPY ./container_files/scripts/* /container_files/

#testing datadog integrations
# LABEL "com.datadoghq.ad.check_names"='["forum_svc"]'
# LABEL "com.datadoghq.ad.init_configs"='[{}]'
#LABEL "com.datadoghq.ad.instances"='[{"nginx_status_url": "http://%%host%%:%%port%%/nginx_status"}]'
# LABEL "com.datadoghq.ad.logs"='[{"source": "forum", "service": "backend"}]'
#Allowing entrypoint script to run
RUN chmod +x /container_files/entrypoint.sh 

#Install the app dependencies (will be cached from previous build only if package.json didn't change)
RUN cd /usr/src/app/ && npm install


#Install the app dependencies
#RUN cd /usr/src/app/ && ./node_modules/grunt/bin/grunt build && ./node_modules/grunt/bin/grunt file-versions

# Cleanup of files only needed for the build
# RUN rm -rf /usr/src/app/package.json

EXPOSE 6001

RUN chown -R node: /container_files/ /usr/src/app/
USER node 

WORKDIR /home/node

# HEALTHCHECK --interval=120s --retries=5 --timeout=50s CMD curl http://localhost:6001/ || exit 1
#ping localhost 

ENTRYPOINT ["/container_files/entrypoint.sh"]
# CMD ["node", "$NODE_OPTIONS", "--expose_gc", "/usr/src/app/server.js"]
CMD node --expose_gc /usr/src/app/server.js
# CMD ["node", "--expose_gc", ${NODE_OPTIONS}, "/usr/src/app/server.js"]
# CMD node --max_old_space_size=${NODE_OPTIONS} --expose_gc /usr/src/app/server.js



# PREPARE NODE_MODULES IN PRODUCTION MODE
FROM mhealthvn/node-builder:master as runner
WORKDIR /usr/src/app
ARG GIT_TOKEN
ENV GIT_TOKEN=${GIT_TOKEN}
COPY package.json ./
RUN yarn --non-interactive --prod && node-prune

# BUILD FROM SOURCE
FROM runner as builder
RUN yarn 
COPY . .
RUN yarn build 

# COPY FROM PREVIOUS STAGES  
FROM node:16.3-alpine
RUN apk add curl 
WORKDIR /usr/src/app
COPY package.json ./
COPY test.env ./test.env
COPY --from=runner /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/dist dist
ARG GIT_COMMIT
ARG GIT_BRANCH
RUN echo $BUILD_TAG $(date "+%F %T%z") "("$(echo $GIT_COMMIT | cut -c1-7) $GIT_BRANCH")" > "./version.txt"
USER 1
CMD ["node", "dist/main"]

FROM node:lts-alpine

LABEL maintainer="<Minh Nguyen> quang.minh@edge-works.net"

RUN mkdir malis3-frontend

WORKDIR /malis3-frontend

ADD ./ /malis3-frontend/

RUN yarn install && yarn build

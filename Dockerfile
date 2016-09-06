FROM node:latest
MAINTAINER Federico Gonzalez <https://github.com/fedeg>

RUN apt-get update -y && apt-get install -y git && apt-get clean

RUN npm install -g mocha grunt grunt-cli
RUN npm config set registry http://registry.npmjs.org

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN touch .env
ADD package.json /usr/src/app/
RUN npm install
ADD . /usr/src/app

CMD [ "npm", "start" ]

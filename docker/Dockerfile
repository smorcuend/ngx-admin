FROM node:10.15-alpine as node-angular-cli

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install

EXPOSE 4200
CMD ["npm", "run", "start"]

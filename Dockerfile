FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY ./ .
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine as production-state

ADD nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist/. /usr/share/nginx/html

EXPOSE 8080

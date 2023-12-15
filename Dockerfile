# Base image of service specific images.

FROM node:20-alpine AS development
ARG APP
ARG NODE_ENV=development
ENV NDOE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build ${APP}
WORKDIR /usr/src/app/dist

FROM node:20-alpine AS production
ARG APP
ARG NODE_ENV=production
ENV NODE_ENV=${production}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY --from=development /usr/src/app/dist ./dist

ENV APP_MAIN_FILE=dist/apps/${APP}/main.js
CMD node ${APP_MAIN_FILE}

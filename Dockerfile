FROM node:22.18.0 AS build-env

WORKDIR /build

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build:prod


FROM node:22.18.0-alpine

WORKDIR /app

COPY --from=build-env /build/dist/apps/server ./

RUN apk add --no-cache bash && yarn install --frozen-lockfile --production

CMD ["node", "/app/main.js"]

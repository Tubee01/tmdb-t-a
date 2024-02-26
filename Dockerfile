FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as version
COPY package.json .

RUN apk update && apk add --no-cache \
    jq \
    && rm -rf /var/cache/apk/* \
    && jq .version package.json > /version.txt

FROM base AS fetch
# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch --ignore-scripts

FROM fetch AS install
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --offline --ignore-scripts


FROM install AS build-backend
COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM base AS production-backend
WORKDIR /app

COPY --from=build-backend /dist ./dist
COPY --from=build-backend /node_modules ./node_modules
COPY --from=version /version.txt .

CMD npm_package_version=$(cat ./version.txt) node dist/main


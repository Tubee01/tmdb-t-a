FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as version
WORKDIR /app
COPY ./apps/backend/package.json ./backend-package.json
COPY ./apps/frontend/package.json ./frontend-package.json

RUN apk update && apk add --no-cache \
    jq \
    && rm -rf /var/cache/apk/* \
    && jq .version ./backend-package.json -r > /backend-version.txt \
    && jq .version ./frontend-package.json -r > /frontend-version.txt

FROM base AS fetch
# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./
RUN pnpm fetch --ignore-scripts

FROM fetch AS install
WORKDIR /usr/src/app
COPY ./apps/backend/package.json ./apps/backend/
COPY ./apps/frontend/package.json ./apps/frontend/
COPY ./pnpm-workspace.yaml .
COPY ./pnpm-lock.yaml .
COPY ./package.json .
RUN pnpm install -r --offline --ignore-scripts

FROM install AS build-backend
COPY ./apps/backend ./apps/backend
RUN pnpm --filter=backend build
RUN pnpm deploy --filter=backend --prod --ignore-scripts  /prod/backend

FROM install AS build-frontend
COPY ./apps/frontend ./apps/frontend
COPY ./apps/frontend/.example.env ./apps/frontend/.env

RUN pnpm --filter=frontend build
RUN pnpm deploy --filter=frontend --prod --ignore-scripts /prod/frontend

FROM base AS production-backend
WORKDIR /app

COPY --from=build-backend /prod/backend .
COPY --from=version /backend-version.txt version.txt

CMD npm_package_version=$(cat ./version.txt) node dist/main

FROM base AS production-frontend
WORKDIR /app

COPY --from=build-frontend /prod/frontend .
COPY --from=version /frontend-version.txt  version.txt

CMD npm_package_version=$(cat ./version.txt) node build


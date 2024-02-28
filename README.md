# Applications

| App                     |
| ----------------------- |
| [@backend](apps/backend)   |
| [@frontend](apps/frontend) |

## Development

### Prerequisites

- [Node.js@^20](https://nodejs.org/en/download/)
- [pnpm@^8](https://pnpm.io/installation)
- [Docker](https://www.docker.com/products/docker-desktop)

### Getting Started

1. Install dependencies

   ```bash
   pnpm install
   ```
2. Setup the environment

   ```bash
   cp ./apps/backend/.example.env ./apps/backend/.env
   ```
3. Using Docker, start the database

   ```bash
   docker compose up -d
   ```
4. Start the development server

   ```bash
    pnpm dev
   ```

   or separately

   ```bash
   pnpm dev:backend

   pnpm dev:frontend
   ```

## Deployment

1. Setup the environment

   ```bash
   cp .example.env .env
   ```
2. Using Docker, deploy the application

   ```bash
   pnpm docker:prod
   ```
3. Open the browser and navigate to `http://localhost`

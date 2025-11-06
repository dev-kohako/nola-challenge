FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lockb* tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
COPY .env .env

RUN bun install --frozen-lockfile
RUN bunx prisma generate

EXPOSE 4000

CMD ["bun", "run", "dev"]

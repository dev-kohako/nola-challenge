FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lockb* tsconfig.json ./

RUN bun install --frozen-lockfile

COPY src ./src
COPY prisma ./prisma

RUN bunx prisma generate

EXPOSE 4000

CMD ["bun", "run", "src/index.ts"]

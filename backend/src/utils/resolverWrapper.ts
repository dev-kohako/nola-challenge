import { GraphQLError } from "graphql";

const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT = 1000;
const WINDOW_MS = 60_000;

const interval = setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestTimestamps.entries()) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) requestTimestamps.delete(ip);
    else requestTimestamps.set(ip, recent);
  }
}, WINDOW_MS);

if (process.env.NODE_ENV === "test") {
  clearInterval(interval);
}

export function wrapResolver<T extends (...args: any[]) => any>(
  fn: T,
  limit = RATE_LIMIT
) {
  return async (parent: any, args: any, context: any) => {
    const ip = context?.ip || context?.req?.ip || "unknown";
    const now = Date.now();
    const timestamps = requestTimestamps.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    requestTimestamps.set(ip, recent);

    if (recent.length > limit) {
      throw new GraphQLError("⛔ Rate limit exceeded. Try again later.", {
        extensions: { code: "RATE_LIMIT", http: { status: 429 } },
      });
    }

    try {
      return await fn(parent, args, context);
    } catch (err: any) {
      console.error(`[Resolver Error] ${fn.name || "anonymous"}:`, err);
      throw new GraphQLError(err.message || "Erro interno no servidor.", {
        extensions: {
          code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
          http: { status: err.statusCode || 500 },
        },
      });
    }
  };
}

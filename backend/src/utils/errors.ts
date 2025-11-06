export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly timestamp: string;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export const toAppError = (
  err: unknown,
  fallback = "Unexpected error",
  status = 400
): AppError => {
  if (err instanceof AppError) return err;
  if (err instanceof Error)
    return new AppError(err.message || fallback, status);
  return new AppError(fallback, status, err);
};

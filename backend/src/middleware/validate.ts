import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";
import type { ZodTypeAny } from "zod";

declare global {
  namespace Express {
    interface Request {
      /** Populated by {@link validateBody} after a successful parse. */
      validatedBody?: unknown;
    }
  }
}

type RequestWithValidatedBody<S extends ZodTypeAny> = Request & {
  validatedBody: z.infer<S>;
};

/**
 * Express middleware that parses and validates `req.body` with a Zod schema.
 * On success, sets `req.validatedBody` to the parsed value and calls `next()`.
 * On failure, responds with HTTP 400 and a stable JSON error payload.
 */
export function validateBody<S extends ZodTypeAny>(schema: S): RequestHandler {
  return (req, res, next): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        issues: result.error.flatten(),
      });
      return;
    }
    req.validatedBody = result.data;
    next();
  };
}

/**
 * Pairs {@link validateBody} with a handler that receives `req.validatedBody`
 * typed as `z.infer<typeof schema>` (aligned with the DTO module).
 */
export function withValidatedBody<S extends ZodTypeAny>(
  schema: S,
  handler: (
    req: RequestWithValidatedBody<S>,
    res: Response,
    _next: NextFunction,
  ) => void,
): RequestHandler[] {
  return [
    validateBody(schema),
    (req, res, next): void => {
      handler(req as RequestWithValidatedBody<S>, res, next);
    },
  ];
}

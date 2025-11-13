/**
 * Lightweight Zod resolver for React Hook Form.
 * Eliminates dependency on @hookform/resolvers/zod (which depends on unavailable zod/v4).
 */
import type { FieldError, FieldErrors, Resolver } from "react-hook-form";
import type { ZodIssue, ZodTypeAny, infer as Infer } from "zod";

const ROOT_ERROR_KEY = "root";

const toFieldError = (issue: ZodIssue): FieldError => ({
  message: issue.message,
  type: issue.code,
});

const setAtPath = (
  target: Record<PropertyKey, unknown>,
  path: ReadonlyArray<string | number>,
  value: FieldError,
): void => {
  if (path.length === 0) {
    target[ROOT_ERROR_KEY] = value;
    return;
  }

  let cursor: Record<PropertyKey, unknown> | Array<unknown> = target;

  path.forEach((segment, index) => {
    const key = segment;
    const isLeaf = index === path.length - 1;

    if (isLeaf) {
      if (Array.isArray(cursor)) {
        (cursor as Array<unknown>)[Number(key)] = value;
      } else {
        (cursor as Record<PropertyKey, unknown>)[key] = value;
      }
      return;
    }

    if (Array.isArray(cursor)) {
      if (!(Number(key) in cursor)) {
        cursor[Number(key)] = typeof path[index + 1] === "number" ? [] : {};
      }
      cursor = cursor[Number(key)] as Record<PropertyKey, unknown> | Array<unknown>;
    } else {
      if (!(key in cursor)) {
        (cursor as Record<PropertyKey, unknown>)[key] =
          typeof path[index + 1] === "number" ? [] : {};
      }
      cursor = (cursor as Record<PropertyKey, unknown>)[
        key
      ] as Record<PropertyKey, unknown> | Array<unknown>;
    }
  });
};

export const zodResolver = <TSchema extends ZodTypeAny>(
  schema: TSchema,
): Resolver<Infer<TSchema>> =>
  async (values, context, options) => {
    void context;
    void options;
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {} as FieldErrors<Infer<TSchema>>,
      };
    }

    const fieldErrors: FieldErrors<Infer<TSchema>> = {};
    result.error.issues.forEach((issue) => {
      setAtPath(
        fieldErrors as Record<PropertyKey, unknown>,
        issue.path,
        toFieldError(issue),
      );
    });

    return {
      values: {} as Infer<TSchema>,
      errors: fieldErrors,
    };
  };

export type ZodResolver = typeof zodResolver;

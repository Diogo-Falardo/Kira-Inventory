import { z } from "zod";

/**
 * Returns a shallow copy of `obj` containing only keys whose values are NOT `undefined`.
 *
 * - Useful for building payloads where `undefined` should mean "omit this field".
 * - Keeps `null`, `false`, `0`, and `""` (only removes `undefined`).
 * - Shallow: it does not recurse into nested objects.
 *
 * Note on typing:
 * `Object.fromEntries` returns a generic `Record<string, unknown>` at runtime, so we cast to `Partial<T>`.
 */
export function pickDefined<T extends object>(obj: T): Partial<T> {
  // Turn the object into [key, value] tuples.
  return Object.fromEntries(
    Object.entries(obj)
      // Keep only entries where the value is defined.
      .filter(([, v]) => v !== undefined),
  ) as Partial<T>; // Cast because TS can't infer the precise key/value types through fromEntries.
}

export const PriceInEuros = z.preprocess(
  (val) => {
    // Accept number from DB and stringify it
    if (typeof val === "number") return String(val);
    // Accept string as-is
    if (typeof val === "string") return val;
    return val; // let Zod throw for other types
  },
  z
    .string()
    .transform((val) => val.trim().replace(",", ".")) // normalize comma → dot
    .pipe(
      z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, {
          message:
            "Invalid format. Use up to 2 decimal places (example: 19.99 or 19,99)",
        })
        .transform((val) => Number(val))
        .refine((n) => !isNaN(n), { message: "Not a valid number" })
        .refine((n) => n > 0, { message: "Price must be positive" })
        // You don't really need this check because the regex already enforces 0–2 decimals,
        // but keeping it is fine.
        .refine((n) => Number(n.toFixed(2)) === n, {
          message: "Price must have at most 2 decimal places",
        })
        // Convert euros -> cents (integer)
        .transform((n) => Math.round(n * 100)),
    ),
);

export const zId = z.coerce.number().int().positive("Invalid id");

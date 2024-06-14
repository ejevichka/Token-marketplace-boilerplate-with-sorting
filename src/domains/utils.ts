import * as z from "zod";

export const errorLike = z.object({
  name: z.string().optional(),
  message: z.string(),
});

export type ErrorLike = z.infer<typeof errorLike>;

export function extractErrorMessage(raw: unknown) {
  const err = errorLike.safeParse(raw);
  if (err.data) {
    return err.data.message;
  }
  return "Unhandled error occured";
}

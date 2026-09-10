import { z } from "zod";

export const executeModeSchema = z.enum(["run", "submit", "try"]);

export const executionApiRequestSchema = z.object({
  problemSlug: z.string().min(1).max(128),
  languageSlug: z.string().min(1).max(64),
  source: z.string().min(1),
  mode: executeModeSchema,
  stdin: z.string().max(65536).optional(),
});

export type ExecutionApiRequest = z.infer<typeof executionApiRequestSchema>;

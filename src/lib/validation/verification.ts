import { z } from "zod"

export const certificateIdSchema = z
  .string()
  .trim()
  .min(6, "Enter the full Certificate ID.")
  .max(40, "That ID is longer than expected.")

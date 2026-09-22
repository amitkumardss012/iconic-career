import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  mobile: z
    .string()
    .trim()
    .min(8, "Enter a mobile number.")
    .max(20, "Enter a shorter mobile number."),
  subject: z.string().trim().min(3, "Enter a subject."),
  message: z
    .string()
    .trim()
    .min(12, "Please write a slightly longer message.")
    .max(2000, "Please shorten this message."),
})

export type ContactInput = z.infer<typeof contactSchema>

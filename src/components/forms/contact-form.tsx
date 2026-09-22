import * as React from "react"
import { contactSchema, type ContactInput } from "@/lib/validation/contact"
import { submitContactMessage } from "@/lib/services/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle2Icon, SendIcon, SparklesIcon } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = React.useState<ContactInput>({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [serverMessage, setServerMessage] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const parseRes = contactSchema.safeParse(formData)
    if (!parseRes.success) {
      const fieldErrors: Record<string, string> = {}
      parseRes.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("Form Validation Error", {
        description: "Please check the highlighted fields and try again.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitContactMessage(parseRes.data)
      if (res.status === "success") {
        setIsSuccess(true)
        setServerMessage(res.message)
        toast.success("Message Transmitted", {
          description: res.message,
        })
      } else {
        toast.error("Transmission Error", {
          description: res.message,
        })
      }
    } catch {
      toast.error("Network Error", {
        description: "Failed to send message. Please check your connection.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-3xl border border-[#e4dccf] bg-white p-8 sm:p-12 flex flex-col items-center text-center gap-5 shadow-[0_12px_40px_rgba(20,35,60,0.05)]">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2Icon className="size-7" />
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold text-[#14233c]">
            Message Transmitted Successfully
          </h3>
          <p className="text-xs sm:text-sm text-[#596579] max-w-md mt-2 leading-relaxed">
            {serverMessage ||
              "Your inquiry has been cataloged in our admissions tracking system. A coordination advisor will respond within 1 business day."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsSuccess(false)
            setFormData({
              name: "",
              email: "",
              mobile: "",
              subject: "",
              message: "",
            })
          }}
          className="mt-2 rounded-xl border-[#14233c] text-[#14233c] hover:bg-[#14233c] hover:text-white text-xs font-semibold"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#e4dccf] bg-white p-7 sm:p-10 flex flex-col gap-5 shadow-[0_12px_40px_rgba(20,35,60,0.05)]"
    >
      <div className="flex flex-col gap-1 border-b border-[#ede7de] pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-1 font-mono w-fit">
          <span>INQUIRY FORM</span>
        </div>
        <h3 className="font-heading text-2xl font-bold text-[#14233c]">
          Send an Official Inquiry
        </h3>
        <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
          Submit your question below and our coordination team will review and respond promptly.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contactName" className="text-xs font-semibold text-[#14233c]">
          Full Legal Name
        </Label>
        <Input
          id="contactName"
          placeholder="e.g. Priya Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting}
          className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
            errors.name ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {errors.name && (
          <span className="text-xs text-destructive font-medium">{errors.name}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contactEmail" className="text-xs font-semibold text-[#14233c]">
            Email Address
          </Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isSubmitting}
            className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
              errors.email ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          {errors.email && (
            <span className="text-xs text-destructive font-medium">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contactMobile" className="text-xs font-semibold text-[#14233c]">
            Mobile Number
          </Label>
          <Input
            id="contactMobile"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
            disabled={isSubmitting}
            className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
              errors.mobile ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          {errors.mobile && (
            <span className="text-xs text-destructive font-medium">{errors.mobile}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contactSubject" className="text-xs font-semibold text-[#14233c]">
          Inquiry Subject
        </Label>
        <Input
          id="contactSubject"
          placeholder="e.g. Question regarding internship cohort schedule or fee breakdown"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          disabled={isSubmitting}
          className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
            errors.subject ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {errors.subject && (
          <span className="text-xs text-destructive font-medium">{errors.subject}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contactMessage" className="text-xs font-semibold text-[#14233c]">
          Detailed Message
        </Label>
        <Textarea
          id="contactMessage"
          rows={5}
          placeholder="Please describe your inquiry, background, or institutional requirements..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          disabled={isSubmitting}
          className={`rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] resize-none ${
            errors.message ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {errors.message && (
          <span className="text-xs text-destructive font-medium">{errors.message}</span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-12 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white text-xs sm:text-sm font-semibold shadow-xs gap-2 transition-all"
      >
        {isSubmitting ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Transmitting Inquiry...</span>
          </>
        ) : (
          <>
            <SendIcon className="size-4" />
            <span>Submit Official Inquiry</span>
          </>
        )}
      </Button>
    </form>
  )
}

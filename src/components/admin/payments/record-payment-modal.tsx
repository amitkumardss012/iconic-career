import * as React from "react"
import { toast } from "sonner"
import {
  X,
  CreditCard,
  UserCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileText,
  DollarSign,
  Wallet,
  Building2,
  QrCode,
  Landmark,
} from "lucide-react"
import { createPaymentTransactionFn } from "@/lib/server/payments"
import { getEnrollmentsFn } from "@/lib/server/enrollments"
import type { EnrollmentRecordItem } from "@/lib/services/enrollments"

interface RecordPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preselectedEnrollment?: EnrollmentRecordItem | null
}

const generateFrontendReceiptNumber = () => {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(10000 + Math.random() * 90000)
  return `RCP-${year}-${randomSuffix}`
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedEnrollment,
}: RecordPaymentModalProps) {
  const [enrollments, setEnrollments] = React.useState<EnrollmentRecordItem[]>([])
  const [loadingEnrollments, setLoadingEnrollments] = React.useState(false)

  // Form states
  const [selectedEnrollmentId, setSelectedEnrollmentId] = React.useState<number | "">("")
  const [amount, setAmount] = React.useState<string>("")
  const [gateway, setGateway] = React.useState<
    "MANUAL_ADMIN" | "RAZORPAY" | "STRIPE" | "CASHFREE" | "INSTAMOJO"
  >("MANUAL_ADMIN")
  const [method, setMethod] = React.useState<
    "UPI" | "NET_BANKING" | "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "CASH" | "CHEQUE" | "WALLET" | "SCHOLARSHIP" | "OTHER"
  >("UPI")
  const [receiptNumber, setReceiptNumber] = React.useState<string>(() => generateFrontendReceiptNumber())
  const [transactionReference, setTransactionReference] = React.useState<string>("")
  const [gatewayOrderId, setGatewayOrderId] = React.useState<string>("")
  const [gatewayPaymentId, setGatewayPaymentId] = React.useState<string>("")
  const [paidAt, setPaidAt] = React.useState<string>(() => new Date().toISOString().split("T")[0])
  const [notes, setNotes] = React.useState<string>("")

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Fetch enrollments on open if not preselected
  React.useEffect(() => {
    if (!isOpen) return

    setReceiptNumber(generateFrontendReceiptNumber())
    setErrorMessage(null)

    if (preselectedEnrollment) {
      setSelectedEnrollmentId(preselectedEnrollment.id)
      const remaining = Math.max(0, (preselectedEnrollment.program?.price || 0) - (preselectedEnrollment.amountPaid || 0))
      setAmount(remaining > 0 ? String(remaining) : String(preselectedEnrollment.program?.price || 0))
      return
    }

    let isMounted = true
    setLoadingEnrollments(true)

    getEnrollmentsFn({ data: { limit: 100, page: 1 } })
      .then((res) => {
        if (isMounted) {
          setEnrollments(res.items || [])
          if (res.items.length > 0 && !selectedEnrollmentId) {
            const first = res.items[0]
            setSelectedEnrollmentId(first.id)
            const remaining = Math.max(0, (first.program?.price || 0) - (first.amountPaid || 0))
            setAmount(remaining > 0 ? String(remaining) : String(first.program?.price || 0))
          }
        }
      })
      .catch((err) => {
        if (isMounted) console.error("Error loading enrollments for payment:", err)
      })
      .finally(() => {
        if (isMounted) setLoadingEnrollments(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, preselectedEnrollment])

  const selectedEnrollment = React.useMemo(() => {
    if (preselectedEnrollment && preselectedEnrollment.id === Number(selectedEnrollmentId)) {
      return preselectedEnrollment
    }
    return enrollments.find((e) => e.id === Number(selectedEnrollmentId)) || null
  }, [selectedEnrollmentId, enrollments, preselectedEnrollment])

  // Financial calculations
  const programPrice = Number(selectedEnrollment?.program?.price || 0)
  const currentPaid = Number(selectedEnrollment?.amountPaid || 0)
  const remainingDue = Math.max(0, programPrice - currentPaid)

  // Auto-update suggested amount when enrollment selection changes
  const handleEnrollmentChange = (id: number) => {
    setSelectedEnrollmentId(id)
    const enr = enrollments.find((e) => e.id === id)
    if (enr) {
      const pPrice = Number(enr.program?.price || 0)
      const cPaid = Number(enr.amountPaid || 0)
      const due = Math.max(0, pPrice - cPaid)
      setAmount(due > 0 ? String(due) : String(pPrice))
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedEnrollmentId) {
      setErrorMessage("Please select a student enrollment.")
      return
    }

    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Please enter a valid payment amount greater than 0.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createPaymentTransactionFn({
        data: {
          enrollmentId: Number(selectedEnrollmentId),
          amount: numericAmount,
          currency: "INR",
          type: "PAYMENT",
          status: "SUCCESS",
          gateway,
          method,
          receiptNumber: receiptNumber.trim() || undefined,
          transactionReference: transactionReference.trim() || null,
          gatewayOrderId: gatewayOrderId.trim() || null,
          gatewayPaymentId: gatewayPaymentId.trim() || null,
          paidAt: paidAt ? new Date(paidAt).toISOString() : undefined,
          notes: notes.trim() || null,
        },
      })

      toast.success(
        `Payment of ₹${res.amount.toLocaleString("en-IN")} recorded successfully! (Receipt: ${res.receiptNumber})`
      )
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Payment error:", err)
      setErrorMessage(err.message || "Failed to record payment transaction.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1726]/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-[#14233c] text-white px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b8864d] to-[#e4b574] text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Record Enrollment Payment
              </h2>
              <p className="text-xs text-white/70">
                Process manual tuition receipts, installments, or online gateway transactions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm shrink-0">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Section 1: Candidate Enrollment Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#b8864d]" />
              Target Student Enrollment <span className="text-destructive">*</span>
            </label>
            {preselectedEnrollment ? (
              <div className="p-3.5 rounded-xl bg-accent/40 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#b8864d] font-semibold block">
                    {preselectedEnrollment.enrollmentNumber}
                  </span>
                  <div className="text-sm font-semibold text-foreground">
                    {preselectedEnrollment.user?.name} ({preselectedEnrollment.user?.email})
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Track: {preselectedEnrollment.program?.title} [{preselectedEnrollment.program?.type}]
                  </div>
                </div>
              </div>
            ) : (
              <select
                value={selectedEnrollmentId}
                onChange={(e) => handleEnrollmentChange(Number(e.target.value))}
                disabled={loadingEnrollments || isSubmitting}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                {enrollments.map((enr) => (
                  <option key={enr.id} value={enr.id}>
                    {enr.enrollmentNumber} — {enr.user?.name} ({enr.user?.email}) | {enr.program?.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Section 2: Financial Overview Pill */}
          {selectedEnrollment && (
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-accent/30 border border-border text-center">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Program Fee
                </span>
                <span className="text-sm font-bold text-foreground">₹{programPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-x border-border/80">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Already Paid
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{currentPaid.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  Remaining Due
                </span>
                <span className="text-sm font-bold text-[#b8864d]">
                  ₹{remainingDue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          {/* Section 3: Amount Paid & Quick Fill */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#b8864d]" />
                Payment Amount (₹) <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {remainingDue > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(remainingDue))}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#b8864d]/10 hover:bg-[#b8864d]/20 text-[#b8864d] transition-colors"
                  >
                    Pay Due (₹{remainingDue})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAmount(String(programPrice))}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-accent hover:bg-accent/80 text-foreground transition-colors"
                >
                  Full Fee (₹{programPrice})
                </button>
              </div>
            </div>
            <input
              type="number"
              min="1"
              required
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
            />
          </div>

          {/* Section 4: Receipt Number with Auto-Generate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#b8864d]" />
                Receipt / Invoice Number
              </label>
              <button
                type="button"
                onClick={() => setReceiptNumber(generateFrontendReceiptNumber())}
                className="text-xs font-semibold text-[#b8864d] hover:text-[#966432] flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-[#b8864d]/10"
                title="Auto-generate a new receipt serial"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Generate
              </button>
            </div>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="e.g. RCP-2026-00892"
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
            />
          </div>

          {/* Section 5: Gateway & Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Gateway / Channel
              </label>
              <select
                value={gateway}
                onChange={(e: any) => setGateway(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                <option value="MANUAL_ADMIN">Manual Admin Entry</option>
                <option value="RAZORPAY">Razorpay Gateway</option>
                <option value="STRIPE">Stripe Payments</option>
                <option value="CASHFREE">Cashfree</option>
                <option value="INSTAMOJO">Instamojo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e: any) => setMethod(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="NET_BANKING">Net Banking (NEFT / RTGS / IMPS)</option>
                <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="CASH">Cash in Hand</option>
                <option value="CHEQUE">Cheque / Demand Draft</option>
                <option value="WALLET">Digital Wallet</option>
                <option value="SCHOLARSHIP">Scholarship / Fee Waiver</option>
                <option value="OTHER">Other Method</option>
              </select>
            </div>
          </div>

          {/* Section 6: Transaction Reference & Paid Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bank UTR / Cheque / Txn Ref
              </label>
              <input
                type="text"
                placeholder="e.g. UTR_2026_988124 or CHQ#44120"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b8864d]" />
                Payment Date
              </label>
              <input
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              />
            </div>
          </div>

          {/* Section 7: Online Gateway IDs (collapsible/optional) */}
          {(gateway === "RAZORPAY" || gateway === "STRIPE") && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-3">
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Online Gateway Order & Payment IDs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Gateway Order ID (e.g. order_O1234567)"
                  value={gatewayOrderId}
                  onChange={(e) => setGatewayOrderId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-blue-500/30 bg-background text-xs"
                />
                <input
                  type="text"
                  placeholder="Gateway Payment ID (e.g. pay_P1234567)"
                  value={gatewayPaymentId}
                  onChange={(e) => setGatewayPaymentId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-blue-500/30 bg-background text-xs"
                />
              </div>
            </div>
          )}

          {/* Section 8: Admin Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Internal Accounting Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. First installment paid via PhonePe UPI. Remaining balance due on 15th."
              className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#14233c] to-[#20365c] hover:from-[#1c3052] hover:to-[#2b487b] text-white text-sm font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording Payment...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#e4b574]" />
                  Confirm & Record Receipt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

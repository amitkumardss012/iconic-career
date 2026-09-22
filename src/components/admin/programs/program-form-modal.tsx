import * as React from "react"
import {
  X,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  Calendar,
  IndianRupee,
  Star,
  Flame,
  Award,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import type { ProgramRecordItem, ProgramCategoryItem, ImageType } from "@/lib/types/programs"
import {
  getProgramCategoriesFn,
  createProgramFn,
  updateProgramFn,
} from "@/lib/server/programs"
import { generateSlug } from "@/lib/types/programs"
import { CategoryManagerModal } from "./category-manager-modal"
import { ImageUploadPicker } from "@/components/common/image-upload-picker"

interface ProgramFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: ProgramRecordItem | null
  defaultType?: "COURSE" | "INTERNSHIP"
}

type TabType = "general" | "schedule" | "pricing" | "curriculum"

export function ProgramFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  defaultType = "COURSE",
}: ProgramFormModalProps) {
  const [categories, setCategories] = React.useState<ProgramCategoryItem[]>([])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<TabType>("general")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Form Fields State
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [type, setType] = React.useState<"COURSE" | "INTERNSHIP">(defaultType)
  const [categoryId, setCategoryId] = React.useState<number | "">("")
  const [status, setStatus] = React.useState<"DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED">("DRAFT")
  const [level, setLevel] = React.useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS">("ALL_LEVELS")
  const [deliveryMode, setDeliveryMode] = React.useState<"ONLINE" | "OFFLINE" | "HYBRID">("HYBRID")

  // Content
  const [shortDescription, setShortDescription] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [highlightInput, setHighlightInput] = React.useState("")
  const [highlights, setHighlights] = React.useState<string[]>([])
  const [outcomeInput, setOutcomeInput] = React.useState("")
  const [learningOutcomes, setLearningOutcomes] = React.useState<string[]>([])

  // Media (Structured ImageType JSON)
  const [thumbnail, setThumbnail] = React.useState<ImageType | string | null>(null)
  const [banner, setBanner] = React.useState<ImageType | string | null>(null)
  const [syllabusUrl, setSyllabusUrl] = React.useState("")

  // Schedule & Duration
  const [duration, setDuration] = React.useState("3 Months")
  const [durationHours, setDurationHours] = React.useState<number | "">("")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  // Pricing & Badges
  const [price, setPrice] = React.useState<number>(0)
  const [discountPrice, setDiscountPrice] = React.useState<number | "">("")
  const [currency, setCurrency] = React.useState("INR")
  const [maxCapacity, setMaxCapacity] = React.useState<number | "">("")

  const [rating, setRating] = React.useState<number>(4.9)
  const [ratingCount, setRatingCount] = React.useState<number>(0)
  const [isBestseller, setIsBestseller] = React.useState(false)
  const [isFeatured, setIsFeatured] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [certificateOffered, setCertificateOffered] = React.useState(true)

  // Load Categories
  const loadCategories = React.useCallback(async () => {
    try {
      const cats = await getProgramCategoriesFn({ data: { isActive: "ACTIVE" } })
      setCategories(cats)
      if (cats.length > 0 && !categoryId && !initialData) {
        setCategoryId(cats[0].id)
      }
    } catch {
      toast.error("Failed to load categories.")
    }
  }, [categoryId, initialData])

  React.useEffect(() => {
    if (isOpen) {
      loadCategories()
      if (initialData) {
        setTitle(initialData.title)
        setSlug(initialData.slug)
        setType(initialData.type as any)
        setCategoryId(initialData.categoryId)
        setStatus(initialData.status as any)
        setLevel(initialData.level as any)
        setDeliveryMode(initialData.deliveryMode as any)
        setShortDescription(initialData.shortDescription || "")
        setDescription(initialData.description || "")
        setHighlights(Array.isArray(initialData.highlights) ? (initialData.highlights as string[]) : [])
        setLearningOutcomes(Array.isArray(initialData.learningOutcomes) ? (initialData.learningOutcomes as string[]) : [])
        setThumbnail((initialData.thumbnail as any) || null)
        setBanner((initialData.banner as any) || null)
        setSyllabusUrl(initialData.syllabusUrl || "")
        setDuration(initialData.duration || "3 Months")
        setDurationHours(initialData.durationHours ?? "")
        setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : "")
        setEndDate(initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : "")
        setPrice(initialData.price)
        setDiscountPrice(initialData.discountPrice ?? "")
        setCurrency(initialData.currency || "INR")
        setMaxCapacity(initialData.maxCapacity ?? "")
        setRating(initialData.rating)
        setRatingCount(initialData.ratingCount)
        setIsBestseller(initialData.isBestseller)
        setIsFeatured(initialData.isFeatured)
        setIsActive(initialData.isActive)
        setCertificateOffered(initialData.certificateOffered)
      } else {
        // Reset Defaults
        setTitle("")
        setSlug("")
        setType(defaultType)
        setStatus("PUBLISHED")
        setLevel("ALL_LEVELS")
        setDeliveryMode("HYBRID")
        setShortDescription("")
        setDescription("")
        setHighlights([])
        setLearningOutcomes([])
        setThumbnail(null)
        setBanner(null)
        setSyllabusUrl("")
        setDuration(defaultType === "INTERNSHIP" ? "6 Months" : "3 Months")
        setDurationHours(defaultType === "COURSE" ? 120 : 240)
        setStartDate("")
        setEndDate("")
        setPrice(defaultType === "COURSE" ? 14999 : 0)
        setDiscountPrice("")
        setCurrency("INR")
        setMaxCapacity("")
        setRating(4.9)
        setRatingCount(48)
        setIsBestseller(false)
        setIsFeatured(false)
        setIsActive(true)
        setCertificateOffered(true)
      }
      setActiveTab("general")
    }
  }, [isOpen, initialData, defaultType, loadCategories])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!initialData) {
      setSlug(generateSlug(val))
    }
  }

  const handleAddHighlight = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return
    e.preventDefault()
    if (highlightInput.trim()) {
      setHighlights((prev) => [...prev, highlightInput.trim()])
      setHighlightInput("")
    }
  }

  const handleAddOutcome = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return
    e.preventDefault()
    if (outcomeInput.trim()) {
      setLearningOutcomes((prev) => [...prev, outcomeInput.trim()])
      setOutcomeInput("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !slug.trim()) {
      toast.error("Program title and slug are required.")
      return
    }

    if (!categoryId) {
      toast.error("Please assign a category to this program.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: any = {
        title: title.trim(),
        slug: slug.trim(),
        type,
        categoryId: Number(categoryId),
        status,
        level,
        deliveryMode,
        shortDescription: shortDescription.trim() || null,
        description: description.trim() || null,
        highlights,
        learningOutcomes,
        thumbnail: thumbnail || null,
        banner: banner || null,
        syllabusUrl: syllabusUrl.trim() || null,
        duration: duration.trim() || null,
        durationHours: durationHours ? Number(durationHours) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        price: Number(price) || 0,
        discountPrice: discountPrice ? Number(discountPrice) : null,
        currency,
        maxCapacity: maxCapacity ? Number(maxCapacity) : null,
        rating: Number(rating) || 0,
        ratingCount: Number(ratingCount) || 0,
        isBestseller,
        isFeatured,
        isActive,
        certificateOffered,
      }

      if (initialData) {
        await updateProgramFn({ data: { id: initialData.id, ...payload } })
        toast.success(`Program "${title}" updated successfully!`)
      } else {
        await createProgramFn({ data: payload })
        toast.success(`Program "${title}" created successfully!`)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to save program.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-[#14233c] px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#b8864d] to-[#e4b574] text-[#14233c] font-bold shadow-xs">
                {type === "COURSE" ? <BookOpen className="size-5" /> : <Briefcase className="size-5" />}
              </div>
              <div>
                <h3 className="font-heading text-base font-bold">
                  {initialData ? `Edit ${type === "COURSE" ? "Course" : "Internship Track"}` : `Create New ${type === "COURSE" ? "Course" : "Internship Track"}`}
                </h3>
                <p className="text-[0.68rem] text-slate-300">
                  Configure curriculum structure, schedule, pricing tiers, and visibility
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50/80">
            {[
              { id: "general", label: "1. Core Details" },
              { id: "schedule", label: "2. Schedule & Duration" },
              { id: "pricing", label: "3. Pricing & Badges" },
              { id: "curriculum", label: "4. Highlights & Media" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-[#b8864d] text-[#14233c] font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* TAB 1: Core Details */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Track Type */}
                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Program Track *
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    >
                      <option value="COURSE">Academic Course</option>
                      <option value="INTERNSHIP">Corporate Internship Track</option>
                    </select>
                  </div>

                  {/* Category with Quick Add */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700">
                        Academic Domain *
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[0.68rem] font-bold text-[#8e653e] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="size-3" /> Add Domain
                      </button>
                    </div>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Program Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masterclass in Full Stack Web Engineering & Cloud Architecture"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none font-medium"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    URL Slug * (SEO Identifier)
                  </label>
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-[#14233c] focus-within:bg-white">
                    <span className="font-mono text-xs text-slate-400">/programs/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                      className="h-9 w-full bg-transparent font-mono text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Level, Delivery Mode & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    >
                      <option value="ALL_LEVELS">All Levels</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Delivery Mode
                    </label>
                    <select
                      value={deliveryMode}
                      onChange={(e) => setDeliveryMode(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    >
                      <option value="HYBRID">Hybrid (Live + Self-paced)</option>
                      <option value="ONLINE">100% Online</option>
                      <option value="OFFLINE">In-Person Campus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    >
                      <option value="PUBLISHED">Published (Live)</option>
                      <option value="DRAFT">Draft</option>
                      <option value="CLOSED">Enrollment Closed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Short Hook / Summary (Card Preview)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Comprehensive industry curriculum with 1-on-1 mentorship..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Schedule & Duration */}
            {activeTab === "schedule" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Calendar className="size-4 text-[#8e653e]" />
                    <span>Schedule Context: {type === "COURSE" ? "Batch Calendar" : "Flexible Duration"}</span>
                  </div>
                  <p className="text-[0.72rem] text-slate-600">
                    {type === "COURSE"
                      ? "Courses have fixed batch start and end dates. Fill in the cohort calendar below."
                      : "Internships typically feature rolling start dates (e.g. 3, 6, or 8 Months). Dates are optional."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Nominal Duration *
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    >
                      <option value="1 Month">1 Month Fast-Track</option>
                      <option value="3 Months">3 Months Standard</option>
                      <option value="6 Months">6 Months Supervised Industrial</option>
                      <option value="8 Months">8 Months Comprehensive</option>
                      <option value="12 Weeks">12 Weeks Bootcamp</option>
                      <option value="Self-Paced">Self-Paced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Estimated Learning Hours
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value ? Number(e.target.value) : "")}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Batch Start Date {type === "COURSE" ? "(Recommended)" : "(Optional)"}
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Batch End Date {type === "COURSE" ? "(Recommended)" : "(Optional)"}
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Maximum Batch Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 60 candidates"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value ? Number(e.target.value) : "")}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Pricing & Social Proof */}
            {activeTab === "pricing" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Regular Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="e.g. 14999 (0 for Free)"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Discount / Offer Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 9999"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : "")}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
                    Social Proof & Ratings
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Display Rating (0.0 - 5.0)
                      </label>
                      <div className="flex items-center gap-2">
                        <Star className="size-4 text-amber-500 fill-amber-500 shrink-0" />
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={5}
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Review Count
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 142"
                        value={ratingCount}
                        onChange={(e) => setRatingCount(Number(e.target.value))}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Badges and Flags */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                    Marketing & Badges
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBestseller}
                        onChange={(e) => setIsBestseller(e.target.checked)}
                        className="size-4 rounded border-slate-300 text-[#14233c] focus:ring-[#14233c]"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Flame className="size-3.5 text-amber-600" /> Bestseller Badge
                        </span>
                        <span className="text-[0.65rem] text-slate-500">Highlights program with a golden ribbon</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="size-4 rounded border-slate-300 text-[#14233c] focus:ring-[#14233c]"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Sparkles className="size-3.5 text-[#b8864d]" /> Featured on Homepage
                        </span>
                        <span className="text-[0.65rem] text-slate-500">Pushed to prime carousel spot</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={certificateOffered}
                        onChange={(e) => setCertificateOffered(e.target.checked)}
                        className="size-4 rounded border-slate-300 text-[#14233c] focus:ring-[#14233c]"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Award className="size-3.5 text-violet-600" /> Certificate Included
                        </span>
                        <span className="text-[0.65rem] text-slate-500">Grants cryptographically signed credential</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="size-4 rounded border-slate-300 text-[#14233c] focus:ring-[#14233c]"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-600" /> Active Enrollment
                        </span>
                        <span className="text-[0.65rem] text-slate-500">Accepts new candidate registrations</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Curriculum Highlights & Media */}
            {activeTab === "curriculum" && (
              <div className="space-y-5">
                {/* Media Assets (Upload & Compression < 100 KB) */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Program Media & Assets
                    </span>
                    <p className="text-[0.68rem] text-slate-500">
                      Upload from device gallery — automatically compressed to &lt; 100 KB and stored in Cloud Storage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Thumbnail Upload (16:9 Card Preview) */}
                    <ImageUploadPicker
                      label="Program Thumbnail *"
                      value={thumbnail}
                      onChange={(img) => setThumbnail(img)}
                      aspectRatio="16:9"
                      folder="programs/thumbnails"
                      recommendedSizeText="1200×675 (Card Preview)"
                    />

                    {/* Banner Upload (Header Banner) */}
                    <ImageUploadPicker
                      label="Header Banner (Optional)"
                      value={banner}
                      onChange={(img) => setBanner(img)}
                      aspectRatio="16:9"
                      folder="programs/banners"
                      recommendedSizeText="1920×800 (Header Cover)"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Syllabus PDF URL / Download Key (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://.../curriculum-spec.pdf"
                      value={syllabusUrl}
                      onChange={(e) => setSyllabusUrl(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Highlights List Builder */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700">
                    Key Highlights (Bullet Points)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 50+ Production Deployments, 1:1 Resume Review"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={handleAddHighlight}
                      className="h-8.5 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {highlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-medium text-slate-700 border border-slate-200"
                        >
                          <span>{h}</span>
                          <button
                            type="button"
                            onClick={() => setHighlights((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Detailed Description */}
                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Full Description / Curriculum Architecture
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive breakdown of modules, projects, industry partners, and tech stack..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {activeTab !== "general" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "schedule") setActiveTab("general")
                      if (activeTab === "pricing") setActiveTab("schedule")
                      if (activeTab === "curriculum") setActiveTab("pricing")
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Previous
                  </button>
                )}

                {activeTab !== "curriculum" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "general") setActiveTab("schedule")
                      if (activeTab === "schedule") setActiveTab("pricing")
                      if (activeTab === "pricing") setActiveTab("curriculum")
                    }}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#14233c] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Sparkles className="size-3.5 text-[#e4b574]" />
                        <span>{initialData ? "Save Changes" : "Publish Program"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Category Management Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoriesChanged={loadCategories}
      />
    </>
  )
}

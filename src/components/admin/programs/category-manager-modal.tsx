import * as React from "react"
import {
  X,
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import type { ProgramCategoryItem, ImageType } from "@/lib/types/programs"
import {
  getProgramCategoriesFn,
  createProgramCategoryFn,
  updateProgramCategoryFn,
  deleteProgramCategoryFn,
} from "@/lib/server/programs"
import { generateSlug, resolveImageUrl } from "@/lib/types/programs"
import { ImageUploadPicker } from "@/components/common/image-upload-picker"

interface CategoryManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoriesChanged?: () => void
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  onCategoriesChanged,
}: CategoryManagerModalProps) {
  const [categories, setCategories] = React.useState<ProgramCategoryItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)

  // Form states
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [icon, setIcon] = React.useState("")
  const [thumbnail, setThumbnail] = React.useState<ImageType | string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Load categories on open
  const loadCategories = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getProgramCategoriesFn({ data: {} })
      setCategories(data)
    } catch (err) {
      toast.error("Failed to load program categories.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      loadCategories()
      resetForm()
    }
  }, [isOpen, loadCategories])

  const resetForm = () => {
    setEditingId(null)
    setName("")
    setSlug("")
    setDescription("")
    setIcon("")
    setThumbnail(null)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingId) {
      setSlug(generateSlug(val))
    }
  }

  const handleEditClick = (cat: ProgramCategoryItem) => {
    setEditingId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || "")
    setIcon(cat.icon || "")
    setThumbnail((cat.thumbnail as any) || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      toast.error("Category name and slug are required.")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateProgramCategoryFn({
          data: {
            id: editingId,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim() || undefined,
            icon: icon.trim() || undefined,
            thumbnail: thumbnail || null,
          },
        })
        toast.success(`Category "${name}" updated successfully.`)
      } else {
        await createProgramCategoryFn({
          data: {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim() || undefined,
            icon: icon.trim() || undefined,
            thumbnail: thumbnail || null,
          },
        })
        toast.success(`Category "${name}" created successfully.`)
      }

      resetForm()
      await loadCategories()
      onCategoriesChanged?.()
    } catch (err: any) {
      toast.error(err.message || "Failed to save category.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (cat: ProgramCategoryItem) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return

    try {
      await deleteProgramCategoryFn({ data: { id: cat.id } })
      toast.success("Category deleted.")
      await loadCategories()
      onCategoriesChanged?.()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#14233c] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#b8864d]/20 text-[#e4b574] border border-[#b8864d]/30">
              <FolderTree className="size-4.5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">Program Categories</h3>
              <p className="text-[0.68rem] text-slate-300">
                Organize curricula & internship tracks into academic domains
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

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-y-auto">
          {/* Form Pane (Left 2 cols) */}
          <div className="md:col-span-2 p-5 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {editingId ? "Edit Category" : "Add New Category"}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[0.68rem] font-semibold text-[#8e653e] hover:underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Engineering"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="full-stack-engineering"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                  className="h-8.5 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of this curriculum track..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none resize-none"
                />
              </div>

              <div>
                <ImageUploadPicker
                  label="Category Thumbnail / Icon"
                  value={thumbnail}
                  onChange={(val) => setThumbnail(val)}
                  aspectRatio="1:1"
                  folder="categories"
                  helperText="Compressed under 100 KB"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : editingId ? (
                  <>
                    <Edit2 className="size-3.5 text-[#e4b574]" />
                    <span>Update Category</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5 text-[#e4b574]" />
                    <span>Save Category</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Pane (Right 3 cols) */}
          <div className="md:col-span-3 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Existing Domains ({categories.length})
              </span>
              <span className="text-[0.68rem] text-slate-400">Programs Assigned</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="size-6 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
                <span className="text-xs font-medium">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Layers className="mx-auto size-8 text-slate-300 mb-2" />
                <p className="text-xs">No categories created yet.</p>
                <p className="text-[0.68rem] text-slate-400">Use the form on the left to add your first domain.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const catThumb = resolveImageUrl(cat.thumbnail)

                  return (
                    <div
                      key={cat.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        editingId === cat.id
                          ? "border-[#b8864d] bg-[#b8864d]/5 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[220px]">
                        <div className="size-8 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {catThumb ? (
                            <img src={catThumb} alt={cat.name} className="size-full object-cover" />
                          ) : (
                            <Layers className="size-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="font-semibold text-xs text-slate-900 truncate">{cat.name}</span>
                          <span className="font-mono text-[0.65rem] text-slate-400 truncate">/{cat.slug}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium text-slate-600">
                          {cat._count?.programs || 0} programs
                        </span>

                        <button
                          type="button"
                          onClick={() => handleEditClick(cat)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

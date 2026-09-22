import * as React from "react"
import { Users, UserCheck, UserX, Award, ShieldAlert } from "lucide-react"
import type { StudentStatsSummary } from "@/lib/services/students"

interface StudentStatsBarProps {
  stats: StudentStatsSummary
  currentFilter: string
  onFilterSelect: (status: string) => void
}

export function StudentStatsBar({ stats, currentFilter, onFilterSelect }: StudentStatsBarProps) {
  const cards = [
    {
      id: "ALL",
      label: "Total Enrolled",
      value: stats.total.toLocaleString(),
      icon: Users,
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50 border-blue-200",
    },
    {
      id: "ACTIVE",
      label: "Active Students",
      value: stats.active.toLocaleString(),
      icon: UserCheck,
      color: "from-emerald-600 to-teal-700",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "INACTIVE",
      label: "Inactive / On Hold",
      value: stats.inactive.toLocaleString(),
      icon: UserX,
      color: "from-amber-600 to-yellow-700",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50 border-amber-200",
    },
    {
      id: "COMPLETED",
      label: "Completed Alumni",
      value: stats.completed.toLocaleString(),
      icon: Award,
      color: "from-[#b8864d] to-[#8e653e]",
      textColor: "text-[#b8864d]",
      bgLight: "bg-amber-50/60 border-[#b8864d]/30",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const isSelected = currentFilter === card.id

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onFilterSelect(card.id)}
            className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
              isSelected
                ? `${card.bgLight} ring-2 ring-slate-900/10 shadow-sm`
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <div className={`flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-2xs`}>
                <Icon className="size-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-slate-900">{card.value}</span>
              <span className="text-[0.65rem] font-medium text-slate-500">
                {isSelected ? "Filtering active" : "Click to filter"}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

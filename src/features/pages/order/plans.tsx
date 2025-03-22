"use client"

import type { JSX } from "react"
import { FormatPrice } from "@/utils/formatPrice"
import type { PlansProps } from "@/types/category"

export function PlansOrder({
  plan,
  onSelect,
  isSelected,
}: {
  plan: PlansProps
  onSelect: (select: PlansProps) => void
  isSelected?: boolean
}): JSX.Element {
  const price = plan.isFlashSale ? plan.hargaFlashSale : plan.harga

  return (
    <section
      onClick={() =>
        onSelect({
          ...plan,
          harga: price,
        })
      }
      className={`cursor-pointer rounded-xl border transition-all duration-300 relative overflow-hidden ${
        isSelected
          ? "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400 shadow-lg shadow-blue-900/30"
          : "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 hover:shadow-md hover:shadow-blue-900/20"
      }`}
    >
      {/* Flash Sale Badge */}
      {plan.isFlashSale && (
        <div className="absolute -top-1 -right-8 transform rotate-45 bg-red-500 text-white text-xs py-1 px-8 font-bold">
          SALE
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {/* Service Name with Optional Icon */}
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 ${isSelected ? "text-blue-200" : "text-blue-400"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 1L1 5l11 4 11-4-11-4zM1 12l3-1v6l8 3 8-3v-6l3 1V5L12 9 1 5v7z" />
          </svg>
          <h3 className={`font-medium ${isSelected ? "text-white" : "text-gray-200"}`}>{plan.layanan}</h3>
        </div>

        {/* Price Section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400">Harga</p>
            <div className="flex items-center gap-2">
              {plan.isFlashSale && (
                <span className="text-xs text-gray-400 line-through">{FormatPrice(plan.harga)}</span>
              )}
              <p
                className={`font-semibold text-lg ${
                  isSelected ? "text-white" : plan.isFlashSale ? "text-red-300" : "text-gray-200"
                }`}
              >
                {FormatPrice(price)}
              </p>
            </div>
          </div>

          {/* Improved Call to Action Button */}
          <button
            className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-300 ${
              isSelected
                ? "bg-white text-blue-600 shadow-md shadow-blue-500/20"
                : "bg-blue-600/20 text-blue-300 hover:bg-blue-500 hover:text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onSelect({
                ...plan,
                harga: price,
              })
            }}
          >
            {isSelected ? "Terpilih" : "Pilih"}
          </button>
        </div>
      </div>
    </section>
  )
}


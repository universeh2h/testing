import { Input } from "@/components/ui/input";
import { Search, Receipt, Gamepad } from "lucide-react";

interface HeaderInvoiceProps {
  onChange: (term: string) => void;
  term: string;
}

export function HeaderFindInvoice({ onChange, term }: HeaderInvoiceProps) {
  return (
    <section className="rounded-lg shadow-lg mb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-[#8EA7E9]" />
            <h2 className="text-xl font-bold text-white">Find Your Invoice</h2>
          </div>
          <div className="bg-[#3B5CCC] p-1 rounded-md">
            <Gamepad className="h-5 w-5 text-[#8EA7E9]" />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#8EA7E9]" />
          </div>
          <Input
            className="w-full pl-10 py-2 bg-[#001F54] border border-[#3B5CCC] text-white placeholder-[#A6B3D1] focus:ring-[#4A76E1] focus:border-[#4A76E1] rounded-lg shadow-inner shadow-[rgba(74, 118, 225, 0.2)]"
            placeholder="Search by invoice number, game ID or username..."
            value={term}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

// frontend/components/market/SymbolSelector.tsx

"use client";

import { ChevronDown } from "lucide-react";

import Select from "@/components/ui/Select";

interface SymbolSelectorProps {
  value: string;
  onChange: (symbol: string) => void;
  symbols?: string[];
  disabled?: boolean;
}

const DEFAULT_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
];

export default function SymbolSelector({
  value,
  onChange,
  symbols = DEFAULT_SYMBOLS,
  disabled = false,
}: SymbolSelectorProps) {
  const options = symbols.map((symbol) => ({
    label: symbol,
    value: symbol,
  }));

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Symbol
      </span>

      <div className="relative min-w-[150px]">
        <Select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          options={options}
          className="appearance-none pr-9"
        />

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}

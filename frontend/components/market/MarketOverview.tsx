
// frontend/components/market/MarketOverview.tsx

"use client";

import {
  RefreshCw,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import SymbolSelector from "./SymbolSelector";
import PriceCard from "./PriceCard";
import FundingCard from "./FundingCard";
import OpenInterestCard from "./OpenInterestCard";
import LiquidationCard from "./LiquidationCard";
import OrderBook from "./OrderBook";
import TradeFlow from "./TradeFlow";

import type {
  Kline,
} from "@/types/market";

interface MarketOverviewProps {
  symbol: string;

  onSymbolChange: (
    symbol: string
  ) => void;

  onRefresh?: () => void;

  loading?: boolean;

  price: number | null;

  change24h?: number | null;

  high24h?: number | null;

  low24h?: number | null;

  volume24h?: number | null;

  fundingRate?: number | null;

  nextFundingTime?: number | null;

  openInterest?: number | null;

  openInterestChangePct?: number | null;

  longLiquidation?: number | null;

  shortLiquidation?: number | null;

  klines?: Kline[];

  bids?: Array<{
    price: number;
    quantity: number;
    total?: number;
  }>;

  asks?: Array<{
    price: number;
    quantity: number;
    total?: number;
  }>;

  trades?: Array<{
    id: string;
    timestamp: number;
    price: number;
    quantity: number;
    side: "buy" | "sell";
  }>;
}

export default function MarketOverview({
  symbol,
  onSymbolChange,
  onRefresh,
  loading = false,

  price,
  change24h,
  high24h,
  low24h,
  volume24h,

  fundingRate,
  nextFundingTime,

  openInterest,
  openInterestChangePct,

  longLiquidation,
  shortLiquidation,

  bids = [],
  asks = [],
  trades = [],
}: MarketOverviewProps) {
  const spread =
    bids.length > 0 &&
    asks.length > 0
      ? asks[0].price -
        bids[0].price
      : null;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SymbolSelector
            value={symbol}
            onChange={
              onSymbolChange
            }
            disabled={loading}
          />

          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-slate-500 sm:block">
              {loading
                ? "Updating..."
                : "Live market data"}
            </div>

            {onRefresh && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={
                    loading
                      ? "h-4 w-4 animate-spin"
                      : "h-4 w-4"
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Primary market cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PriceCard
          symbol={symbol}
          price={price}
          change24h={change24h}
          high24h={high24h}
          low24h={low24h}
          volume24h={volume24h}
          loading={loading}
        />

        <FundingCard
          fundingRate={
            fundingRate ?? null
          }
          nextFundingTime={
            nextFundingTime
          }
          loading={loading}
        />

        <OpenInterestCard
          openInterest={
            openInterest ?? null
          }
          changePct={
            openInterestChangePct
          }
          loading={loading}
        />

        <LiquidationCard
          longLiquidation={
            longLiquidation ?? null
          }
          shortLiquidation={
            shortLiquidation ?? null
          }
          loading={loading}
        />
      </div>

      {/* Microstructure */}
      <div className="grid gap-5 xl:grid-cols-2">
        <OrderBook
          bids={bids}
          asks={asks}
          spread={spread}
          loading={loading}
        />

        <TradeFlow
          trades={trades}
          loading={loading}
        />
      </div>
    </div>
  );
}


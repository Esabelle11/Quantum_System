
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bitcoin,
  Database,
  Gauge,
  Layers3,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import SymbolSelector from "@/components/market/SymbolSelector";
import MarketOverview from "@/components/market/MarketOverview";
import PriceCard from "@/components/market/PriceCard";
import FundingCard from "@/components/market/FundingCard";
import OpenInterestCard from "@/components/market/OpenInterestCard";
import LiquidationCard from "@/components/market/LiquidationCard";
import OrderBook from "@/components/market/OrderBook";
import TradeFlow from "@/components/market/TradeFlow";

import CandlestickChart from "@/components/charts/CandlestickChart";
import VolumeChart from "@/components/charts/VolumeChart";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useMarket } from "@/hooks/useMarket";

const DEFAULT_SYMBOL = "BTCUSDT";

export default function MarketPage() {
  const {
    market,
    loading,
    error,
    refetch,
  } = useMarket(DEFAULT_SYMBOL);

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Market Data
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Markets
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Real-time market state, derivatives positioning, and order flow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SymbolSelector
              value={DEFAULT_SYMBOL}
              onChange={(symbol) => {
                window.location.href =
                  `/market/${symbol}`;
              }}
            />

            <button
              type="button"
              onClick={() => refetch?.()}
              disabled={loading}
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
            >
              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium text-red-400">
                  Market data unavailable
                </div>

                <div className="mt-1 text-[11px] text-slate-600">
                  {error}
                </div>
              </div>

              <button
                type="button"
                onClick={() => refetch?.()}
                className="rounded-md border border-slate-800 px-3 py-1.5 text-[11px] text-slate-400 hover:text-white"
              >
                Retry
              </button>
            </div>
          </Card>
        )}

        {/* Market status */}
        <div className="mb-5 flex items-center gap-3">
          <Badge
            variant={
              error
                ? "danger"
                : loading
                ? "default"
                : "success"
            }
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />

            {error
              ? "Disconnected"
              : loading
              ? "Loading"
              : "Live"}
          </Badge>

          <span className="text-[10px] text-slate-600">
            Bybit Perpetual
          </span>
        </div>

        {/* Market overview */}
        <section>
          <MarketOverview
            market={market}
            loading={loading}
          />
        </section>

        {/* Price / derivatives */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PriceCard
            market={market}
            loading={loading}
          />

          <FundingCard
            market={market}
            loading={loading}
          />

          <OpenInterestCard
            market={market}
            loading={loading}
          />

          <LiquidationCard
            market={market}
            loading={loading}
          />
        </section>

        {/* Main chart */}
        <section className="mt-5 grid gap-4 xl:grid-cols-4">
          <Card className="min-h-[460px] p-5 xl:col-span-3">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  BTCUSDT Price
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Candlestick and volume data
                </p>
              </div>

              <Link
                href={`/market/${DEFAULT_SYMBOL}`}
                className="flex items-center gap-1 text-[11px] text-slate-500 transition hover:text-white"
              >
                Detailed view
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="h-[350px]">
              <CandlestickChart
                data={market?.klines ?? []}
                loading={loading}
              />
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-500" />

                <h2 className="text-sm font-semibold text-white">
                  Market Data
                </h2>
              </div>

              <p className="mt-1 text-[11px] text-slate-600">
                Current data pipeline state.
              </p>
            </div>

            <div className="space-y-4">
              <DataStatus
                label="Price"
                active
              />

              <DataStatus
                label="Klines"
                active
              />

              <DataStatus
                label="Funding"
                active={Boolean(
                  market?.funding
                )}
              />

              <DataStatus
                label="Open Interest"
                active={Boolean(
                  market?.openInterest
                )}
              />

              <DataStatus
                label="Liquidations"
                active={Boolean(
                  market?.liquidations
                )}
              />

              <DataStatus
                label="Order Book"
                active={Boolean(
                  market?.orderBook
                )}
              />

              <DataStatus
                label="Trade Flow"
                active={Boolean(
                  market?.trades
                )}
              />
            </div>
          </Card>
        </section>

        {/* Volume */}
        <section className="mt-5">
          <Card className="p-5">
            <div className="mb-5 flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Volume
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Historical trading volume
                </p>
              </div>
            </div>

            <div className="h-[220px]">
              <VolumeChart
                data={market?.klines ?? []}
                loading={loading}
              />
            </div>
          </Card>
        </section>

        {/* Order flow */}
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <OrderBook
            data={market?.orderBook}
            loading={loading}
          />

          <TradeFlow
            data={market?.trades}
            loading={loading}
          />
        </section>

        {/* Footer information */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={Bitcoin}
            title="Symbol"
            value={DEFAULT_SYMBOL}
          />

          <InfoCard
            icon={Gauge}
            title="Market Type"
            value="USDT Perpetual"
          />

          <InfoCard
            icon={Layers3}
            title="Data Source"
            value="Bybit"
          />
        </div>
      </PageContainer>
    </AppShell>
  );
}

function DataStatus({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-900 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active
              ? "bg-emerald-400"
              : "bg-slate-700"
          }`}
        />

        <span className="text-[10px] text-slate-600">
          {active ? "Active" : "Waiting"}
        </span>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <Icon className="h-4 w-4 text-slate-600" />

      <div className="mt-3 text-[10px] uppercase tracking-wider text-slate-600">
        {title}
      </div>

      <div className="mt-1 text-xs font-medium text-slate-300">
        {value}
      </div>
    </Card>
  );
}
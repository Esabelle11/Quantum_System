
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CandlestickChart as CandlestickIcon,
  Activity,
  Layers3,
  RefreshCw,
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
import FeatureChart from "@/components/charts/FeatureChart";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useMarket } from "@/hooks/useMarket";

import { useParams } from "next/navigation";

export default function MarketSymbolPage() {
  const params =
    useParams<{
      symbol: string;
    }>();

  const symbol = (
    params?.symbol ??
    "BTCUSDT"
  ).toUpperCase();

  const {
    market,
    loading,
    error,
    refetch,
  } = useMarket(symbol);

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/market"
            className="mb-4 inline-flex items-center gap-2 text-[11px] text-slate-600 transition hover:text-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to markets
          </Link>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-slate-500" />

                <span className="text-[10px] uppercase tracking-widest text-slate-600">
                  Market Detail
                </span>

                <Badge
                  variant={
                    error
                      ? "danger"
                      : loading
                      ? "default"
                      : "success"
                  }
                >
                  {error
                    ? "Offline"
                    : loading
                    ? "Loading"
                    : "Live"}
                </Badge>
              </div>

              <h1 className="mt-2 text-2xl font-semibold text-white">
                {symbol}
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Detailed price, derivatives, order flow, and market structure.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <SymbolSelector
                value={symbol}
                onChange={(nextSymbol) => {
                  window.location.href =
                    `/market/${nextSymbol}`;
                }}
              />

              <button
                type="button"
                onClick={() => refetch?.()}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-5 border-red-500/20 p-4">
            <div className="text-xs font-medium text-red-400">
              Unable to load {symbol}
            </div>

            <div className="mt-1 text-[11px] text-slate-600">
              {error}
            </div>
          </Card>
        )}

        {/* Overview */}
        <MarketOverview
          market={market}
          loading={loading}
        />

        {/* Market metrics */}
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

        {/* Price chart */}
        <section className="mt-5">
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
                  <CandlestickIcon className="h-4 w-4 text-slate-500" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Price Action
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-600">
                    {symbol} candlestick data
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-600">
                Bybit
              </span>
            </div>

            <div className="h-[500px]">
              <CandlestickChart
                data={market?.klines ?? []}
                loading={loading}
              />
            </div>
          </Card>
        </section>

        {/* Volume */}
        <section className="mt-5">
          <Card className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <Activity className="h-4 w-4 text-slate-500" />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Volume
                </h2>

                <p className="mt-1 text-[11px] text-slate-600">
                  Trading volume over the selected data range.
                </p>
              </div>
            </div>

            <div className="h-[240px]">
              <VolumeChart
                data={market?.klines ?? []}
                loading={loading}
              />
            </div>
          </Card>
        </section>

        {/* Derivatives */}
        <section className="mt-5">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-slate-500" />

              <h2 className="text-sm font-semibold text-white">
                Derivatives
              </h2>
            </div>

            <p className="mt-1 text-[11px] text-slate-600">
              Positioning and liquidation information.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FundingCard
              market={market}
              loading={loading}
            />

            <OpenInterestCard
              market={market}
              loading={loading}
            />
          </div>
        </section>

        {/* Order flow */}
        <section className="mt-5">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-500" />

              <h2 className="text-sm font-semibold text-white">
                Order Flow
              </h2>
            </div>

            <p className="mt-1 text-[11px] text-slate-600">
              Order book liquidity and executed trades.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <OrderBook
              data={market?.orderBook}
              loading={loading}
            />

            <TradeFlow
              data={market?.trades}
              loading={loading}
            />
          </div>
        </section>

        {/* Liquidations */}
        <section className="mt-5">
          <LiquidationCard
            market={market}
            loading={loading}
          />
        </section>

        {/* Feature section */}
        <section className="mt-5">
          <Card className="p-5">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-slate-500" />

                <h2 className="text-sm font-semibold text-white">
                  Quantitative Features
                </h2>
              </div>

              <p className="mt-1 text-[11px] text-slate-600">
                Features generated by the backend feature pipeline.
              </p>
            </div>

            <div className="h-[300px]">
              <FeatureChart
                data={
                  market?.features ?? []
                }
                loading={loading}
              />
            </div>
          </Card>
        </section>

        {/* Data source */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoItem
            label="Symbol"
            value={symbol}
          />

          <InfoItem
            label="Market"
            value="USDT Perpetual"
          />

          <InfoItem
            label="Exchange"
            value="Bybit"
          />
        </div>
      </PageContainer>
    </AppShell>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </div>

      <div className="mt-1 text-xs font-medium text-slate-300">
        {value}
      </div>
    </Card>
  );
}
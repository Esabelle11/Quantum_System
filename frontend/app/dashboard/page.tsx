
"use client";

import {
  Activity,
  BarChart3,
  Database,
  FlaskConical,
  LineChart,
  Server,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import { useEffect, useState } from "react";

interface MarketResponse {
  symbol: string;
  price: number;
}

interface SystemStatus {
  backend: "online" | "offline" | "checking";
  marketData: "online" | "offline" | "checking";
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export default function DashboardPage() {
  const [market, setMarket] =
    useState<MarketResponse | null>(
      null
    );

  const [status, setStatus] =
    useState<SystemStatus>({
      backend: "checking",
      marketData: "checking",
    });

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const response =
          await fetch(
            `${API_URL}/api/market/btcusdt`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Backend request failed"
          );
        }

        const data =
          (await response.json()) as MarketResponse;

        if (!mounted) {
          return;
        }

        setMarket(data);

        setStatus({
          backend: "online",
          marketData: "online",
        });
      } catch {
        if (!mounted) {
          return;
        }

        setStatus({
          backend: "offline",
          marketData: "offline",
        });
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                Quant System
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              System overview, market state, research, and trading activity.
            </p>
          </div>

          <Badge
            variant={
              status.backend === "online"
                ? "success"
                : status.backend ===
                  "checking"
                ? "default"
                : "danger"
            }
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
            Backend{" "}
            {status.backend}
          </Badge>
        </div>

        {/* Main market card */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    BTCUSDT
                  </span>

                  <Badge variant="default">
                    Perpetual
                  </Badge>
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Live market data from backend
                </p>
              </div>

              <TrendingUp className="h-4 w-4 text-slate-600" />
            </div>

            <div className="mt-8">
              <div className="text-3xl font-semibold tabular-nums text-white">
                {market
                  ? `$${formatPrice(
                      market.price
                    )}`
                  : "--"}
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    status.marketData ===
                    "online"
                      ? "bg-emerald-400"
                      : "bg-slate-600"
                  }`}
                />

                <span className="text-[11px] text-slate-600">
                  {status.marketData ===
                  "online"
                    ? "Market API connected"
                    : "Waiting for market API"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-500" />

              <h2 className="text-sm font-semibold text-white">
                Data Pipeline
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <PipelineItem
                label="Exchange"
                value="Bybit"
                status="Connected"
              />

              <PipelineItem
                label="Market Data"
                value="Klines"
                status={
                  status.marketData ===
                  "online"
                    ? "Active"
                    : "Waiting"
                }
              />

              <PipelineItem
                label="Storage"
                value="Supabase"
                status="Configured"
              />
            </div>
          </Card>
        </div>

        {/* System modules */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">
              Quant Modules
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Core components of the quantitative research and trading pipeline.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ModuleCard
              icon={BarChart3}
              title="Market"
              description="Price, funding, OI, liquidations, order book and trade flow."
              href="/market"
            />

            <ModuleCard
              icon={FlaskConical}
              title="Research"
              description="Features, signals, regimes, hypotheses and evidence."
              href="/research"
            />

            <ModuleCard
              icon={LineChart}
              title="Backtest"
              description="Historical strategy simulation and performance evaluation."
              href="/backtest"
            />

            <ModuleCard
              icon={ShieldCheck}
              title="Strategy"
              description="Strategy configuration, signals and regime logic."
              href="/strategy"
            />
          </div>
        </section>

        {/* Infrastructure */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">
              Infrastructure
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfrastructureCard
              icon={Server}
              label="FastAPI"
              value={
                status.backend ===
                "online"
                  ? "Online"
                  : "Offline"
              }
              online={
                status.backend ===
                "online"
              }
            />

            <InfrastructureCard
              icon={Database}
              label="Supabase"
              value="Configured"
              online
            />

            <InfrastructureCard
              icon={Activity}
              label="Collectors"
              value="Ready"
              online
            />

            <InfrastructureCard
              icon={ShieldCheck}
              label="Risk Engine"
              value="Ready"
              online
            />
          </div>
        </section>

        {/* Development note */}
        <Card className="mt-6 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
              <Activity className="h-4 w-4 text-slate-500" />
            </div>

            <div>
              <h3 className="text-xs font-medium text-slate-300">
                System status
              </h3>

              <p className="mt-1 max-w-3xl text-[11px] leading-5 text-slate-600">
                The frontend is connected to the initial FastAPI market
                endpoint. Research, backtesting, strategy, and execution
                modules can be connected as their backend API endpoints are
                implemented.
              </p>
            </div>
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  );
}

function PipelineItem({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-900 pb-3 last:border-0 last:pb-0">
      <div>
        <div className="text-[11px] text-slate-600">
          {label}
        </div>

        <div className="mt-1 text-xs text-slate-300">
          {value}
        </div>
      </div>

      <span className="text-[10px] text-emerald-500">
        {status}
      </span>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-slate-900 bg-slate-950 p-5 transition hover:border-slate-800 hover:bg-slate-900/40"
    >
      <Icon className="h-4 w-4 text-slate-500 transition group-hover:text-slate-300" />

      <h3 className="mt-4 text-xs font-semibold text-slate-200">
        {title}
      </h3>

      <p className="mt-2 text-[11px] leading-5 text-slate-600">
        {description}
      </p>
    </a>
  );
}

function InfrastructureCard({
  icon: Icon,
  label,
  value,
  online,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  online: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-slate-600" />

        <span
          className={`h-1.5 w-1.5 rounded-full ${
            online
              ? "bg-emerald-400"
              : "bg-red-400"
          }`}
        />
      </div>

      <div className="mt-4 text-xs text-slate-500">
        {label}
      </div>

      <div
        className={`mt-1 text-sm font-medium ${
          online
            ? "text-slate-200"
            : "text-red-400"
        }`}
      >
        {value}
      </div>
    </Card>
  );
}

function formatPrice(
  value: number
) {
  return value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

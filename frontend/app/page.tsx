
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FlaskConical,
  LineChart,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
              <LineChart className="h-4 w-4 text-slate-200" />
            </div>

            <div>
              <div className="text-sm font-semibold text-white">
                Quant System
              </div>

              <div className="text-[10px] uppercase tracking-widest text-slate-600">
                BTCUSDT
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            Sign in
          </Link>
        </header>

        {/* Hero */}
        <section className="flex flex-1 items-center py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Quantitative Research & Trading Platform
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Research.
              <br />
              Backtest.
              <br />
              Trade systematically.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              An autonomous quantitative system for market data collection,
              feature analysis, strategy research, backtesting, risk
              management, and algorithmic execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Open Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/market"
                className="rounded-lg border border-slate-800 px-5 py-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900"
              >
                View Markets
              </Link>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="grid gap-4 border-t border-slate-900 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={BarChart3}
            title="Market Data"
            description="Price, volume, funding, open interest, liquidations, trades, and order book data."
          />

          <Feature
            icon={FlaskConical}
            title="Research"
            description="Analyze quantitative features, signals, regimes, hypotheses, and evidence."
          />

          <Feature
            icon={LineChart}
            title="Backtesting"
            description="Evaluate strategies with historical data, portfolio simulation, and performance metrics."
          />

          <Feature
            icon={ShieldCheck}
            title="Risk & Execution"
            description="Apply risk controls before strategy signals reach the execution layer."
          />
        </section>

        {/* Footer */}
        <footer className="mt-8 flex items-center justify-between border-t border-slate-900 pt-5 text-[10px] text-slate-700">
          <span>
            Quant System
          </span>

          <span>
            v0.1.0
          </span>
        </footer>
      </div>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-900 bg-slate-950 p-5">
      <Icon className="h-4 w-4 text-slate-400" />

      <h2 className="mt-4 text-xs font-semibold text-slate-200">
        {title}
      </h2>

      <p className="mt-2 text-[11px] leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}
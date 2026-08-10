
"use client";

import { useState } from "react";
import {
  Settings,
  Database,
  Activity,
  Shield,
  User,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";

import { useUIStore } from "@/stores/uiStore";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    symbol: "BTCUSDT",
    timeframe: "1m",
    exchange: "bybit",
    dataRefresh: "5000",
    executionMode: "paper",
    maxPositionSize: "1000",
    maxDailyLoss: "100",
    maxDrawdown: "10",
    autoTrading: false,
  });

  const setValue = (
    key: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    /*
     * Later this can persist settings to:
     *
     * 1. Supabase
     * 2. Your FastAPI backend
     * 3. Zustand persistence
     *
     * For now this keeps the page frontend-only.
     */

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    setSettings({
      symbol: "BTCUSDT",
      timeframe: "1m",
      exchange: "bybit",
      dataRefresh: "5000",
      executionMode: "paper",
      maxPositionSize: "1000",
      maxDailyLoss: "100",
      maxDrawdown: "10",
      autoTrading: false,
    });

    setSaved(false);
  };

  return (
    <AppShell>
      <PageContainer>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />

              <span className="text-[10px] uppercase tracking-widest text-slate-600">
                System
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold text-white">
              Settings
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Configure market data, execution, risk controls,
              and application preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <Badge variant="success">
                Settings saved
              </Badge>
            )}

            <Button
              variant="secondary"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Main settings */}
          <div className="space-y-6 xl:col-span-2">
            {/* Market Data */}
            <SettingsSection
              icon={Database}
              title="Market Data"
              description="Configure the market data source used by the quant system."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <SettingField label="Exchange">
                  <Select
                    value={settings.exchange}
                    onChange={(event) =>
                      setValue(
                        "exchange",
                        event.target.value
                      )
                    }
                  >
                    <option value="bybit">
                      Bybit
                    </option>

                    <option value="binance">
                      Binance
                    </option>
                  </Select>
                </SettingField>

                <SettingField label="Symbol">
                  <Select
                    value={settings.symbol}
                    onChange={(event) =>
                      setValue(
                        "symbol",
                        event.target.value
                      )
                    }
                  >
                    <option value="BTCUSDT">
                      BTCUSDT
                    </option>

                    <option value="ETHUSDT">
                      ETHUSDT
                    </option>

                    <option value="SOLUSDT">
                      SOLUSDT
                    </option>
                  </Select>
                </SettingField>

                <SettingField label="Default Timeframe">
                  <Select
                    value={settings.timeframe}
                    onChange={(event) =>
                      setValue(
                        "timeframe",
                        event.target.value
                      )
                    }
                  >
                    <option value="1m">
                      1 minute
                    </option>

                    <option value="5m">
                      5 minutes
                    </option>

                    <option value="15m">
                      15 minutes
                    </option>

                    <option value="1h">
                      1 hour
                    </option>

                    <option value="4h">
                      4 hours
                    </option>

                    <option value="1d">
                      1 day
                    </option>
                  </Select>
                </SettingField>

                <SettingField label="Refresh Interval">
                  <Select
                    value={settings.dataRefresh}
                    onChange={(event) =>
                      setValue(
                        "dataRefresh",
                        event.target.value
                      )
                    }
                  >
                    <option value="1000">
                      1 second
                    </option>

                    <option value="5000">
                      5 seconds
                    </option>

                    <option value="10000">
                      10 seconds
                    </option>

                    <option value="30000">
                      30 seconds
                    </option>
                  </Select>
                </SettingField>
              </div>
            </SettingsSection>

            {/* Execution */}
            <SettingsSection
              icon={Activity}
              title="Execution"
              description="Control how the execution engine operates."
            >
              <div className="space-y-5">
                <SettingField label="Execution Mode">
                  <Select
                    value={settings.executionMode}
                    onChange={(event) =>
                      setValue(
                        "executionMode",
                        event.target.value
                      )
                    }
                  >
                    <option value="paper">
                      Paper Trading
                    </option>

                    <option value="live">
                      Live Trading
                    </option>
                  </Select>
                </SettingField>

                <ToggleSetting
                  title="Automatic Trading"
                  description="Allow strategies to submit orders automatically."
                  checked={settings.autoTrading}
                  onChange={(checked) =>
                    setValue(
                      "autoTrading",
                      checked
                    )
                  }
                />

                {settings.executionMode === "live" && (
                  <div className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                    <div>
                      <div className="text-xs font-medium text-amber-300">
                        Live execution enabled
                      </div>

                      <p className="mt-1 text-[10px] leading-5 text-amber-400/70">
                        Orders may be submitted to the exchange
                        when automatic trading is enabled.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SettingsSection>

            {/* Risk */}
            <SettingsSection
              icon={Shield}
              title="Risk Management"
              description="Configure global limits enforced by the risk manager."
            >
              <div className="grid gap-5 md:grid-cols-3">
                <SettingField label="Max Position Size">
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxPositionSize}
                    onChange={(event) =>
                      setValue(
                        "maxPositionSize",
                        event.target.value
                      )
                    }
                  />
                  <FieldHint>
                    Maximum position value in USDT.
                  </FieldHint>
                </SettingField>

                <SettingField label="Max Daily Loss">
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxDailyLoss}
                    onChange={(event) =>
                      setValue(
                        "maxDailyLoss",
                        event.target.value
                      )
                    }
                  />
                  <FieldHint>
                    Maximum daily loss in USDT.
                  </FieldHint>
                </SettingField>

                <SettingField label="Max Drawdown">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.maxDrawdown}
                    onChange={(event) =>
                      setValue(
                        "maxDrawdown",
                        event.target.value
                      )
                    }
                  />
                  <FieldHint>
                    Maximum portfolio drawdown (%).
                  </FieldHint>
                </SettingField>
              </div>
            </SettingsSection>

            {/* Account */}
            <SettingsSection
              icon={User}
              title="Account"
              description="Account and authentication settings."
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-900 p-4">
                  <div>
                    <div className="text-xs font-medium text-slate-300">
                      Authentication
                    </div>

                    <div className="mt-1 text-[10px] text-slate-600">
                      Supabase authentication is enabled.
                    </div>
                  </div>

                  <Badge variant="success">
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-900 p-4">
                  <div>
                    <div className="text-xs font-medium text-slate-300">
                      Session
                    </div>

                    <div className="mt-1 text-[10px] text-slate-600">
                      Your current application session.
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      window.location.href =
                        "/login";
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* Right-side status */}
          <aside className="space-y-6">
            <SystemStatus />

            <Card className="p-5">
              <div className="text-[10px] uppercase tracking-wider text-slate-600">
                Configuration
              </div>

              <div className="mt-4 space-y-3">
                <ConfigRow
                  label="Exchange"
                  value={settings.exchange}
                />

                <ConfigRow
                  label="Symbol"
                  value={settings.symbol}
                />

                <ConfigRow
                  label="Timeframe"
                  value={settings.timeframe}
                />

                <ConfigRow
                  label="Execution"
                  value={
                    settings.executionMode ===
                    "live"
                      ? "LIVE"
                      : "PAPER"
                  }
                />

                <ConfigRow
                  label="Auto Trading"
                  value={
                    settings.autoTrading
                      ? "Enabled"
                      : "Disabled"
                  }
                />
              </div>
            </Card>

            <Card className="border-red-500/10 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-slate-600" />

                <div>
                  <div className="text-xs font-medium text-slate-300">
                    Trading Safety
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-600">
                    Keep execution in paper mode while testing
                    new strategies and risk parameters.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </PageContainer>
    </AppShell>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-900 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="h-4 w-4 text-slate-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {children}
      </div>
    </Card>
  );
}

function SettingField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-slate-600">
        {label}
      </label>

      {children}
    </div>
  );
}

function FieldHint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-1.5 text-[9px] text-slate-700">
      {children}
    </p>
  );
}

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-900 p-4">
      <div>
        <div className="text-xs font-medium text-slate-300">
          {title}
        </div>

        <p className="mt-1 text-[10px] leading-5 text-slate-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full border transition ${
          checked
            ? "border-emerald-500/40 bg-emerald-500/20"
            : "border-slate-800 bg-slate-950"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition ${
            checked
              ? "left-[18px] bg-emerald-400"
              : "left-0.5 bg-slate-600"
          }`}
        />
      </button>
    </div>
  );
}

function ConfigRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-900 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] text-slate-600">
        {label}
      </span>

      <span className="text-[10px] font-medium uppercase text-slate-300">
        {value}
      </span>
    </div>
  );
}

function SystemStatus() {
  const services = [
    {
      name: "FastAPI",
      status: "Online",
    },
    {
      name: "Supabase",
      status: "Connected",
    },
    {
      name: "Market Data",
      status: "Streaming",
    },
    {
      name: "Risk Manager",
      status: "Ready",
    },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-slate-600" />

        <div className="text-xs font-medium text-white">
          System Status
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between"
          >
            <span className="text-[10px] text-slate-500">
              {service.name}
            </span>

            <span className="flex items-center gap-1.5 text-[9px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
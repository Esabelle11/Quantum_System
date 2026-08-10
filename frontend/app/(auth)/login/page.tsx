
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  LineChart,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const {
      error: signInError,
    } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (signInError) {
      setError(
        signInError.message
      );
      setLoading(false);
      return;
    }

    window.location.href =
      "/dashboard";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
              <LineChart className="h-5 w-5 text-slate-200" />
            </div>

            <div className="text-left">
              <div className="text-sm font-semibold text-white">
                Quant System
              </div>

              <div className="text-[10px] uppercase tracking-widest text-slate-600">
                BTCUSDT
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-white">
              Welcome back
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Sign in to access your quantitative trading system.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                disabled={loading}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-slate-600 disabled:opacity-50"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-400"
                >
                  Password
                </label>

                <Link
                  href="/reset-password"
                  className="text-[11px] text-slate-500 transition hover:text-slate-300"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                disabled={loading}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-slate-600 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs leading-5 text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-slate-400 transition hover:text-white"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-700">
          Quant System · v0.1.0
        </p>
      </div>
    </main>
  );
}

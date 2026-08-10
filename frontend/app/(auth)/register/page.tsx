
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const {
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(
        signUpError.message
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
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

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl">
          {!success ? (
            <>
              <div className="mb-6">
                <h1 className="text-lg font-semibold text-white">
                  Create account
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  Create an account to access the quant research platform.
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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    disabled={loading}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="At least 8 characters"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-slate-600 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    disabled={loading}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Repeat your password"
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-800 pt-5 text-center">
                <p className="text-xs text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-slate-400 transition hover:text-white"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>

              <h1 className="mt-5 text-lg font-semibold text-white">
                Account created
              </h1>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Check your email for a confirmation link before signing in.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Go to sign in
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[10px] text-slate-700">
          Quant System · v0.1.0
        </p>
      </div>
    </main>
  );
}
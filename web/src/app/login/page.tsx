"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageWrapper } from "@/app/components/page-wrapper";
import { apiPost } from "@/lib/api";

const TOKEN_STORAGE_KEY = "plane-spotter-token";
const REFRESH_STORAGE_KEY = "plane-spotter-refresh";

type TokenResponse = {
  access: string;
  refresh: string;
};

type SubscriptionTier = {
  name: string;
  description: string;
  cta: string;
  upcoming: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const subscriptionTiers = useMemo<SubscriptionTier[]>(
    () => [
      {
        name: "Essentials",
        description:
          "Track departures and arrivals in real-time across your favourite airports.",
        cta: "Included with your current login.",
        upcoming: false,
      },
      {
        name: "Pro Fleet",
        description:
          "Unlock historical data exports, advanced filters, and custom alerts for airline operations.",
        cta: "Available soon — sign in to join the waitlist.",
        upcoming: true,
      },
      {
        name: "Enterprise",
        description:
          "Tailored dashboards and API access for partners who need guaranteed uptime and SLAs.",
        cta: "Talk with our team after sign-in to configure seats.",
        upcoming: true,
      },
    ],
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiPost<TokenResponse>("/auth/token/", {
        username,
        password,
      });

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_STORAGE_KEY, data.access);
      storage.setItem(REFRESH_STORAGE_KEY, data.refresh);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="grid gap-12 pt-12 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-white shadow-2xl shadow-cyan-500/5">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Plane Spotter Subscriptions
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Sign in to manage your flights and upcoming subscription benefits
        </h1>
        <p className="text-sm text-slate-300">
          This account unlocks the current experience while laying the groundwork for subscription tiers. Log in now and you will
          be ready when add-ons and premium data packages roll out.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {subscriptionTiers.map((tier) => (
            <article
              key={tier.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-cyan-500/5"
            >
              <h2 className="text-lg font-semibold text-white">{tier.name}</h2>
              <p className="mt-2 text-sm text-slate-200">{tier.description}</p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-cyan-200">{tier.cta}</p>
              {tier.upcoming ? (
                <span className="mt-3 inline-flex w-fit items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                  Coming soon
                </span>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-2xl shadow-cyan-500/5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="text-sm text-slate-300">
              Use your Plane Spotter credentials to continue. We will connect this login to subscription management soon.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-200" htmlFor="username">
              Email or username
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                autoComplete="username"
                placeholder="spotter@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200" htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-100 shadow-inner shadow-black/20 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-slate-950/60 text-cyan-400 focus:ring-cyan-300"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me on this device
              </label>
              <a className="font-medium text-cyan-200 transition hover:text-cyan-100" href="#">
                Forgot password?
              </a>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-cyan-400/40 bg-cyan-500/20 py-2 text-sm font-semibold uppercase tracking-wide text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/25 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">New to Plane Spotter?</p>
            <p className="mt-1 text-slate-300">
              Start with the Essentials tier today and upgrade when subscriptions launch. Sign in and head to the subscriptions tab
              to register your interest.
            </p>
          </div>
        </form>
      </section>
    </PageWrapper>
  );
}

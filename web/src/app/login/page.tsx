"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
    []
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
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-16 px-6 py-16 lg:flex-row lg:items-center">
        <section className="space-y-6 text-white lg:w-1/2">
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1 text-sm font-medium text-blue-300 ring-1 ring-blue-500/40">
            Plane Spotter Subscriptions
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Sign in to manage your flights and upcoming subscription benefits
          </h1>
          <p className="text-slate-300">
            This account unlocks the current experience while laying the groundwork for
            subscription tiers. Log in now and you will be ready when add-ons and premium
            data packages roll out.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {subscriptionTiers.map((tier) => (
              <article
                key={tier.name}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-blue-900/20"
              >
                <h2 className="text-lg font-semibold text-white">{tier.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{tier.description}</p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-blue-300">
                  {tier.cta}
                </p>
                {tier.upcoming ? (
                  <span className="mt-3 inline-flex w-fit items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                    Coming soon
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="w-full rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/20 lg:w-2/5">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-600">
                Use your Plane Spotter credentials to continue. We will connect this login to
                subscription management soon.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block" htmlFor="username">
                <span className="text-sm font-medium text-slate-700">Email or username</span>
                <input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  autoComplete="username"
                  placeholder="spotter@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <label className="block" htmlFor="password">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Remember me on this device
                </label>
                <a className="font-medium text-blue-600 hover:text-blue-500" href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">New to Plane Spotter?</p>
              <p className="mt-1">
                Start with the Essentials tier today and upgrade when subscriptions launch. Sign in
                and head to the subscriptions tab to register your interest.
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

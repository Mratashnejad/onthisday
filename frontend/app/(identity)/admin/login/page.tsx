"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { executeGraphql } from "@/lib/graphql-client";
import { AdminLoginDocument } from "@/gql/graphql";
import { getAdminTokenFromStorage, setAdminTokenInStorage } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminTokenFromStorage();
    if (token) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await executeGraphql(
        AdminLoginDocument,
        {
          usernameOrEmail,
          password,
        },
        { cache: "no-store" },
      );

      setAdminTokenInStorage(response.loginAdmin.accessToken);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ورود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <section className="rounded-3xl border border-brand-navy/16 bg-white/80 p-6 shadow-[0_30px_70px_-58px_rgba(16,39,63,0.85)] md:p-8">
        <h1 className="display-fa text-4xl text-brand-navy">Admin Control Center</h1>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-navy/80">
              نام کاربری یا ایمیل
            </label>
            <input
              value={usernameOrEmail}
              onChange={(event) => setUsernameOrEmail(event.target.value)}
              className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-sm outline-none ring-brand-cyan focus:ring-2"
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-navy/80">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-brand-navy/20 bg-white px-4 py-3 text-sm outline-none ring-brand-cyan focus:ring-2"
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </div>
          {isDevelopment ? (
            <div className="space-y-1 rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              <p>محیط توسعه: از حساب پیش‌فرض استفاده کنید.</p>
              <p>
                نام کاربری: <strong>admin</strong>
              </p>
              <p>
                رمز عبور: <strong>Admin@12345</strong>
              </p>
            </div>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold text-brand-paper transition-colors hover:bg-brand-cyan disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </button>
        </form>
      </section>
    </main>
  );
}

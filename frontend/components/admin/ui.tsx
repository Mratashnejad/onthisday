import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none ring-blue-500 focus:ring-2";

export const textareaClass = `${inputClass} min-h-24 resize-y`;

export const primaryButtonClass =
  "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100";

export const dangerButtonClass =
  "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700";

export const tableCellClass = "px-3 py-2 text-sm text-gray-700";
export const tableHeaderClass =
  "px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500";

export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function AdminFeedback({
  message,
  error,
}: {
  message: string | null;
  error: string | null;
}) {
  return (
    <div className="space-y-3">
      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AdminCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

export function AdminLoading() {
  return (
    <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
      Loading admin data...
    </div>
  );
}

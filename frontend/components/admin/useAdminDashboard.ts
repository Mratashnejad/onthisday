"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboardDataDocument, type AdminDashboardDataQuery } from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";
import {
  clearAdminTokenFromStorage,
  getAdminTokenFromStorage,
} from "@/lib/admin-auth";

type MutationAction = (accessToken: string) => Promise<void>;

export function useAdminDashboard() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboardDataQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(
    async (token: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await executeGraphql(
          AdminDashboardDataDocument,
          {},
          { accessToken: token },
        );
        setDashboard(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load admin data.";
        setError(errorMessage);

        if (errorMessage.toLowerCase().includes("unauthorized")) {
          clearAdminTokenFromStorage();
          router.replace("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const token = getAdminTokenFromStorage();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setAccessToken(token);
    void loadDashboard(token);
  }, [router, loadDashboard]);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    await loadDashboard(accessToken);
  }, [accessToken, loadDashboard]);

  const runMutation = useCallback(
    async (action: MutationAction, successText: string) => {
      if (!accessToken) {
        setError("Admin session is missing. Please login again.");
        return;
      }

      setMessage(null);
      setError(null);

      try {
        await action(accessToken);
        await loadDashboard(accessToken);
        setMessage(successText);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Mutation failed.";
        setError(errorMessage);

        if (errorMessage.toLowerCase().includes("unauthorized")) {
          clearAdminTokenFromStorage();
          router.replace("/admin/login");
        }
      }
    },
    [accessToken, loadDashboard, router],
  );

  const logout = useCallback(() => {
    clearAdminTokenFromStorage();
    router.replace("/admin/login");
  }, [router]);

  return {
    accessToken,
    dashboard,
    loading,
    error,
    message,
    setError,
    setMessage,
    refresh,
    runMutation,
    logout,
  };
}

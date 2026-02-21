import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

type GraphQlError = {
  message: string;
};

type GraphQlResponse<TResult> = {
  data?: TResult;
  errors?: GraphQlError[];
};

const DEFAULT_GRAPHQL_ENDPOINT = "http://localhost:5195/graphql";

function getGraphqlEndpoint(): string {
  return (
    process.env.GRAPHQL_ENDPOINT ??
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
    DEFAULT_GRAPHQL_ENDPOINT
  );
}

type ExecuteGraphqlOptions = {
  accessToken?: string;
  cache?: RequestCache;
};

export async function executeGraphql<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  options?: ExecuteGraphqlOptions,
): Promise<TResult> {
  const headers: HeadersInit = {
    "content-type": "application/json",
  };

  if (options?.accessToken) {
    headers.authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
    cache: options?.cache ?? "no-store",
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as GraphQlResponse<TResult>;

  if (payload.errors?.length) {
    const message = payload.errors.map((error) => error.message).join("; ");
    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error("GraphQL response did not include data.");
  }

  return payload.data;
}

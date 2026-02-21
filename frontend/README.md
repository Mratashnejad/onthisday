# Frontend (Sports Events)

This Next.js app renders the Sports Events page only, and reads data only from the backend GraphQL API.

## 1) Install

```bash
yarn install
```

## 2) Backend endpoint

Set one of these env vars:

```bash
GRAPHQL_ENDPOINT=http://localhost:5195/graphql
# or
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:5195/graphql
```

`GRAPHQL_ENDPOINT` is preferred for server-rendered queries.
In production, at least one of these variables must be set.

## 3) Generate GraphQL types

Backend must be running first.

```bash
yarn codegen
```

This generates typed files in `gql/`.

## 4) Run frontend

```bash
yarn dev
```

Or from repository root:

```bash
yarn frontend:dev
```

## Build

```bash
yarn build
```

## Deploy On Vercel

1) Import this repository in Vercel.

2) Set **Root Directory** to:

```text
frontend
```

3) Set these environment variables in Vercel Project Settings:

```text
GRAPHQL_ENDPOINT=https://your-backend-domain.com/graphql
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend-domain.com/graphql
```

4) Deploy.

If your backend is hosted separately, make sure backend CORS allows your Vercel domain (for example: `https://your-project.vercel.app`).

## Admin Panel

- URL: `/admin/login`
- Seeded default admin credentials:
  - Username: `admin`
  - Password: `Admin@12345`

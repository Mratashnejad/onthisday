import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.CODEGEN_SCHEMA ?? "http://localhost:5195/graphql",
  documents: ["graphql/**/*.graphql"],
  ignoreNoDocuments: false,
  generates: {
    "./gql/": {
      preset: "client",
      plugins: [],
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [...nextVitals, ...nextTs, { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "i18n/gen/**", "app/fr/**", "app/de/**", "app/es/**"] }];

export default config;

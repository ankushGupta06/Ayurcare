import assert from "assert";
import dotenv from "dotenv";
dotenv.config();
const required = [
  "COGNITO_USER_POOL_ID",
  "COGNITO_APP_CLIENT_ID",
  "COGNITO_DOMAIN",
  "COGNITO_REGION",
  "COGNITO_REDIRECT_URI"
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
export const COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID!;
export const COGNITO_APP_CLIENT_SECRET = process.env.COGNITO_APP_CLIENT_SECRET || "";
export const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN!;
export const COGNITO_REGION = process.env.COGNITO_REGION!;
export const COGNITO_REDIRECT_URI = process.env.COGNITO_REDIRECT_URI!;

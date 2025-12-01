import axios from "axios";
import { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET, COGNITO_REDIRECT_URI } from "./env";

type TokenResponse = {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
};

function cleanDomain(d: string) {
  return d.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

const DOMAIN = cleanDomain(COGNITO_DOMAIN);
const TOKEN_URL = `https://${DOMAIN}/oauth2/token`;
const AUTHORIZE_URL = `https://${DOMAIN}/oauth2/authorize`;
const REVOKE_URL = `https://${DOMAIN}/oauth2/revoke`;

async function postForm(url: string, body: URLSearchParams, extraHeaders: Record<string,string> = {}) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    ...extraHeaders,
  };
  const res = await axios.post(url, body.toString(), { headers, timeout: 10000 });
  return res.data;
}

export async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  if (!code) throw new Error("missing_code");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: COGNITO_APP_CLIENT_ID,
    code,
    redirect_uri: COGNITO_REDIRECT_URI,
  });
  const headers: Record<string,string> = {};
  if (COGNITO_APP_CLIENT_SECRET) {
    const basic = Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64");
    headers.Authorization = `Basic ${basic}`;
  }
  try {
    return await postForm(TOKEN_URL, body, headers) as TokenResponse;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) throw new Error(JSON.stringify(err.response.data));
    throw err;
  }
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  if (!refreshToken) throw new Error("missing_refresh_token");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: COGNITO_APP_CLIENT_ID,
    refresh_token: refreshToken,
  });
  const headers: Record<string,string> = {};
  if (COGNITO_APP_CLIENT_SECRET) {
    const basic = Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64");
    headers.Authorization = `Basic ${basic}`;
  }
  try {
    return await postForm(TOKEN_URL, body, headers) as TokenResponse;
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) throw new Error(JSON.stringify(err.response.data));
    throw err;
  }
}

export async function revokeToken(token: string): Promise<void> {
  if (!token) throw new Error("missing_token");
  const body = new URLSearchParams({
    token,
    client_id: COGNITO_APP_CLIENT_ID,
  });
  const headers: Record<string,string> = {};
  if (COGNITO_APP_CLIENT_SECRET) {
    const basic = Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64");
    headers.Authorization = `Basic ${basic}`;
  }
  try {
    await postForm(REVOKE_URL, body, headers);
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) throw new Error(JSON.stringify(err.response.data));
    throw err;
  }
}

export function buildAuthorizeUrl(options?: { state?: string; identity_provider?: string; prompt?: string; }) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: COGNITO_APP_CLIENT_ID,
    redirect_uri: COGNITO_REDIRECT_URI,
    scope: "openid profile email",
  });
  if (options?.state) params.set("state", options.state);
  if (options?.identity_provider) params.set("identity_provider", options.identity_provider);
  if (options?.prompt) params.set("prompt", options.prompt);
  return `${AUTHORIZE_URL}?${params.toString()}`;
}
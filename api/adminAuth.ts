import { createHmac, timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { publicQuery } from "./middleware";

/**
 * 自托管管理员认证：
 * - 账号密码来自环境变量 ADMIN_USERNAME / ADMIN_PASSWORD
 * - 登录成功后签发 HMAC 签名令牌，写入 HttpOnly Cookie
 * - adminProcedure 校验 Cookie 中的令牌
 */

const COOKIE_NAME = "nc_admin";
const TOKEN_TTL_MS = 7 * 24 * 3600 * 1000; // 7 天

function getSecret(): string {
  return (
    process.env.ADMIN_SECRET ||
    process.env.APP_SECRET ||
    "nightcity-dev-secret"
  );
}

export function adminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

export function signAdminToken(username: string): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${username}.${exp}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyAdminToken(token: string): boolean {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split(".");
    if (parts.length !== 3) return false;
    const [username, exp, sig] = parts;
    if (Number.isNaN(Number(exp)) || Number(exp) < Date.now()) return false;
    const expected = createHmac("sha256", getSecret())
      .update(`${username}.${exp}`)
      .digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function buildAdminCookie(token: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(
    TOKEN_TTL_MS / 1000,
  )}`;
}

export function buildClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isAdminRequest(req: Request): boolean {
  const token = readCookie(req, COOKIE_NAME);
  return !!token && verifyAdminToken(token);
}

/** 需要管理员登录的 tRPC 过程 */
export const adminProcedure = publicQuery.use(({ ctx, next }) => {
  if (!isAdminRequest(ctx.req)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "需要管理员登录" });
  }
  return next();
});

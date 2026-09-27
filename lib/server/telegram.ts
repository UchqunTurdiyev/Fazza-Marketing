import "server-only";
import { env, isConfigured } from "./env";

export const escapeHtml = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendTelegram(html: string): Promise<{ ok: boolean; skipped?: string; error?: string }> {
  if (!isConfigured.telegram()) return { ok: false, skipped: "TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_IDS kiritilmagan" };
  const results = await Promise.allSettled(
    env.telegram.chatIds.map(async (chat_id) => {
      const res = await fetch(`https://api.telegram.org/bot${env.telegram.token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${chat_id}: ${res.status} ${await res.text()}`);
    })
  );
  const failed = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
  if (failed.length) console.error("[Telegram] xato", failed.map((f) => String(f.reason)));
  return failed.length === results.length
    ? { ok: false, error: failed.map((f) => String(f.reason)).join("; ") }
    : { ok: true };
}

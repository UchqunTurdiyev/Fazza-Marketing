import { NextRequest, NextResponse } from "next/server";

// Reklama atributsiyasi: UTM belgilar va Meta fbclid ni birinchi tomon cookie'larida saqlaymiz.
// Shunda foydalanuvchi keyinroq (boshqa sahifada) ariza qoldirsa ham manba yo‘qolmaydi,
// va Pixel hali yuklanmagan bo‘lsa ham server CAPI uchun fbc ni tiklay oladi.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const MAX_AGE = 60 * 60 * 24 * 90;

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const sp = req.nextUrl.searchParams;
  const secure = req.nextUrl.protocol === "https:";

  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = sp.get(k);
    if (v) utm[k] = v.slice(0, 200);
  }
  if (Object.keys(utm).length) {
    res.cookies.set("fz_utm", JSON.stringify(utm), { path: "/", maxAge: MAX_AGE, sameSite: "lax", secure });
  }

  const fbclid = sp.get("fbclid");
  if (fbclid) {
    res.cookies.set("fz_fbclid", `${Date.now()}.${fbclid.slice(0, 500)}`, {
      path: "/",
      maxAge: MAX_AGE,
      sameSite: "lax",
      secure,
    });
  }

  if (!req.cookies.get("fz_landing")) {
    res.cookies.set("fz_landing", req.nextUrl.pathname + req.nextUrl.search.slice(0, 300), {
      path: "/",
      maxAge: MAX_AGE,
      sameSite: "lax",
      secure,
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png|images|logos|.*\\..*).*)"],
};

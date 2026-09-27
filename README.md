# FAZZA — Strategik sessiya | sotuv sayti

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Framer Motion.

**Nima bor:**

- Prezentatsiya asosida 14 bo‘limli sotuv sahifasi, animatsiyalar, mobil moslashuv, pastki mobil CTA paneli
- Lid formasi (modal + sahifa ichida) → **Telegram bot** + **Bitrix24** (lid) + **Meta CAPI** (`Lead`)
- Bitrix24 da bitim "Muvaffaqiyatli" bo‘lganda → **Meta CAPI** (`Purchase`, summa va valyuta bilan)
- **Cookie roziligi** (banner + sozlamalar): Meta Pixel faqat rozilik bilan yuklanadi
- UTM va `fbclid` birinchi tomon cookie'larida 90 kun saqlanadi (`proxy.ts`)
- Pixel ↔ CAPI dublikatsiz (`event_id` bir xil), SHA-256 xeshlash, honeypot + rate-limit
- `/rahmat`, `/maxfiylik`, `/cookie-siyosati`, SEO (OG, JSON-LD, sitemap, robots)

---

## 1. Ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to‘ldiring
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start` yoki Vercel'ga deploy qiling (Environment Variables ga `.env.example` dagi o‘zgaruvchilarni kiriting).

> Kalitlarsiz ham sayt ishlaydi — lidlar faqat server logiga yoziladi.

## 2. Telegram bot

1. @BotFather → `/newbot` → tokenni `TELEGRAM_BOT_TOKEN` ga yozing.
2. Botni lidlar guruhiga qo‘shing (admin qilish shart emas) va guruhga biror xabar yozing.
3. `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching → `chat.id` (masalan `-1001234567890`) ni `TELEGRAM_CHAT_IDS` ga yozing. Bir nechta chat bo‘lsa vergul bilan.

## 3. Bitrix24

1. **Kiruvchi vebhuk:** Bitrix24 → Ilovalar → Dasturchilar uchun → Boshqa → *Kiruvchi vebhuk*. Huquq: **CRM (crm)**. URL ni `BITRIX24_WEBHOOK_URL` ga yozing (masalan `https://kompaniya.bitrix24.uz/rest/1/abc123/`).
2. Maxsus maydonlarni yaratish (bir marta):
   ```bash
   npm run bitrix:setup
   ```
   U lid va bitimda `UF_CRM_FAZZA_TRK` (Meta tracking) va bitimda `UF_CRM_FAZZA_CAPI` (qayta yuborilmaslik belgisi) maydonlarini yaratadi.
3. Lid formadan quyidagilar bilan tushadi: ism, telefon, kompaniya, xodimlar soni, paket, UTM (`UTM_SOURCE`…), manba `WEB`.

### Sotuvni Meta'ga yuborish (Purchase)

**A usul — Robot (tavsiya):** CRM → Bitimlar → *Robotlar* → "Muvaffaqiyatli" bosqichiga **Vebhuk (Webhook)** roboti qo‘shing:

```
https://SAYTINGIZ/api/bitrix/purchase?secret=PURCHASE_WEBHOOK_SECRET&deal_id={{ID}}
```

(`{{ID}}` — bitim ID si o‘zgaruvchisi; robot sozlamasida "Element ID" ni tanlang.)

**B usul — Chiquvchi vebhuk:** Dasturchilar uchun → *Chiquvchi vebhuk*, hodisa `ONCRMDEALUPDATE`, URL: `https://SAYTINGIZ/api/bitrix/purchase`. Bitrix bergan *application_token* ni `BITRIX24_APP_TOKEN` ga yozing.

Endpoint faqat `STAGE_SEMANTIC_ID = S` (muvaffaqiyatli) bitimlarni yuboradi. Yuboriladigan ma'lumot: summa (`OPPORTUNITY`), valyuta, kontakt telefoni/e-mail/ismi (xeshlangan) va liddagi `fbp`, `fbc`, IP, User-Agent. `event_id = deal_<ID>` — bir bitim ikki marta hisoblanmaydi. Qo‘lda qayta yuborish: `...&force=1`.

## 4. Meta Pixel + Conversions API

1. Events Manager → Pixel ID → `NEXT_PUBLIC_META_PIXEL_ID` va `META_PIXEL_ID`.
2. Settings → Conversions API → *Generate access token* → `META_CAPI_ACCESS_TOKEN`.
3. Test: Events Manager → *Test events* dagi kodni `META_TEST_EVENT_CODE` ga yozing, forma yuboring — `Lead` (Browser + Server, "Deduplicated") ko‘rinishi kerak. Tekshiruvdan keyin kodni o‘chiring.

| Event | Qayerda | Dedup |
|---|---|---|
| PageView | Pixel (rozilik bilan) | — |
| Lead | Pixel + CAPI | `event_id` (`lead_<uuid>`) |
| Purchase | CAPI (Bitrix24 dan) | `deal_<ID>` |

`external_id` ikkala eventda ham telefon xeshi — Meta Lead va Purchase ni bitta odamga bog‘laydi.

## 5. Cookie

- `fz_consent` — rozilik (180 kun). Banner: "Barchasiga rozilik" / "Faqat zarurlari" / "Sozlash".
- Marketing rozilik berilmaguncha Pixel yuklanmaydi; rozilik qaytarilsa `_fbp/_fbc` o‘chiriladi.
- `fz_utm`, `fz_fbclid`, `fz_landing` — atributsiya uchun (server `_fbc` bo‘lmasa `fbclid` dan tiklaydi).
- `META_CAPI_REQUIRE_CONSENT=true` qilinsa, rozilik bermaganlar uchun Lead CAPI ham yuborilmaydi.
- Footer'dagi "Cookie sozlamalari" orqali istalgan vaqtda o‘zgartiriladi.

## 6. Tuzilma

```
app/
  page.tsx                  bosh sahifa
  api/lead/route.ts         lid → Bitrix24 + Telegram + CAPI Lead
  api/bitrix/purchase/      Bitrix24 bitim WON → CAPI Purchase
  rahmat/ maxfiylik/ cookie-siyosati/
components/sections/        sahifa bo‘limlari
components/lead/            forma va modal
components/consent/         cookie banner, Pixel
lib/content.ts              BARCHA MATNLAR (narx, FAQ, kontaktlar)
lib/server/                 integratsiyalar
proxy.ts                    UTM / fbclid cookie
scripts/bitrix-setup.mjs    Bitrix24 maydonlarini yaratish
```

Matn, narx yoki kontaktni o‘zgartirish uchun faqat `lib/content.ts` ni tahrirlang. Telegram manzilini (`brand.telegram`) o‘zingiznikiga almashtiring.

> Eslatma: `lib/server/rate-limit.ts` xotirada ishlaydi. Vercel kabi serverless muhitda qat’iy limit kerak bo‘lsa, Upstash Redis ulang.
# Fazza-Marketing

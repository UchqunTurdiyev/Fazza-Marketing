// Bitrix24 da kerakli maxsus maydonlarni yaratadi (bir marta ishga tushiriladi):
//   node --env-file=.env.local scripts/bitrix-setup.mjs
//   yoki: npm run bitrix:setup  (BITRIX24_WEBHOOK_URL muhitda bo'lsa)
import fs from "node:fs";

if (!process.env.BITRIX24_WEBHOOK_URL && fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const base = (process.env.BITRIX24_WEBHOOK_URL || "").replace(/\/+$/, "");
if (!base) {
  console.error("BITRIX24_WEBHOOK_URL kiritilmagan (.env.local)");
  process.exit(1);
}

async function bx(method, params = {}) {
  const r = await fetch(`${base}/${method}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const j = await r.json();
  if (j.error) throw new Error(`${method}: ${j.error} ${j.error_description || ""}`);
  return j.result;
}

const fields = [
  { entity: "lead", name: "FAZZA_TRK", type: "string", label: "Sayt tracking (Meta)" },
  { entity: "deal", name: "FAZZA_TRK", type: "string", label: "Sayt tracking (Meta)" },
  { entity: "deal", name: "FAZZA_CAPI", type: "string", label: "Meta Purchase yuborildi" },
];

for (const f of fields) {
  const list = await bx(`crm.${f.entity}.userfield.list`, { filter: { FIELD_NAME: `UF_CRM_${f.name}` } });
  if (Array.isArray(list) && list.length) {
    console.log(`✓ ${f.entity}: UF_CRM_${f.name} allaqachon mavjud`);
    continue;
  }
  await bx(`crm.${f.entity}.userfield.add`, {
    fields: {
      FIELD_NAME: f.name,
      USER_TYPE_ID: f.type,
      XML_ID: f.name,
      EDIT_FORM_LABEL: { ru: f.label, en: f.label },
      LIST_COLUMN_LABEL: { ru: f.label, en: f.label },
      SHOW_IN_LIST: "N",
      EDIT_IN_LIST: "N",
      SETTINGS: { ROWS: 2 },
    },
  });
  console.log(`＋ ${f.entity}: UF_CRM_${f.name} yaratildi`);
}
console.log("\nTayyor. Lid bitimga aylanganda tracking lid orqali ham o'qiladi.");

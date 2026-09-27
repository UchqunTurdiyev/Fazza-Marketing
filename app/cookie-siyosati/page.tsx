import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { CookieSettingsButton } from "./CookieSettingsButton";

export const metadata: Metadata = { title: "Cookie siyosati — FAZZA Management School" };

export default function Page() {
  return (
    <LegalLayout title="Cookie siyosati" updated="2026-yil sentyabr">
      <p>
        Cookie — bu sayt brauzeringizga saqlaydigan kichik matnli fayl. Biz cookie fayllardan sayt to‘g‘ri ishlashi, arizalar
        manbasini aniqlash va reklama samaradorligini o‘lchash uchun foydalanamiz. Zarur bo‘lmagan cookie fayllar faqat
        sizning roziligingiz bilan o‘rnatiladi.
      </p>
      <h2>Qanday cookie fayllardan foydalanamiz</h2>
      <table>
        <thead>
          <tr><th>Nomi</th><th>Turi</th><th>Maqsadi</th><th>Muddati</th></tr>
        </thead>
        <tbody>
          <tr><td>fz_consent</td><td>Zarur</td><td>Cookie bo‘yicha tanlovingizni eslab qolish</td><td>180 kun</td></tr>
          <tr><td>fz_utm</td><td>Zarur</td><td>Reklama manbasi (UTM belgilar) — arizani to‘g‘ri manbaga biriktirish</td><td>90 kun</td></tr>
          <tr><td>fz_fbclid</td><td>Zarur</td><td>Meta reklamasidan kelgan bosish identifikatori</td><td>90 kun</td></tr>
          <tr><td>fz_landing</td><td>Zarur</td><td>Saytga birinchi kirilgan sahifa</td><td>90 kun</td></tr>
          <tr><td>_fbp</td><td>Marketing</td><td>Meta Pixel — brauzer identifikatori</td><td>90 kun</td></tr>
          <tr><td>_fbc</td><td>Marketing</td><td>Meta Pixel — reklama bosish identifikatori</td><td>90 kun</td></tr>
        </tbody>
      </table>
      <h2>Meta Pixel va Conversions API</h2>
      <p>
        Marketing cookie fayllariga rozilik bersangiz, Meta Pixel yuklanadi. Ariza yuborganingizda, reklama samaradorligini
        o‘lchash maqsadida shifrlangan (SHA-256) telefon raqamingiz va texnik identifikatorlar Meta Platforms kompaniyasiga
        Conversions API orqali yuboriladi.
      </p>
      <h2>Tanlovni o‘zgartirish</h2>
      <p>Istalgan vaqtda roziligingizni o‘zgartirishingiz yoki qaytarib olishingiz mumkin:</p>
      <CookieSettingsButton />
      <p>Shuningdek, brauzer sozlamalari orqali cookie fayllarni o‘chirib tashlashingiz mumkin.</p>
    </LegalLayout>
  );
}

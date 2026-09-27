import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { brand } from "@/lib/content";

export const metadata: Metadata = { title: "Maxfiylik siyosati — FAZZA Management School" };

export default function Page() {
  return (
    <LegalLayout title="Maxfiylik siyosati" updated="2026-yil sentyabr">
      <p>
        FAZZA Management School (keyingi o‘rinlarda — “biz”) sayt orqali qoldirilgan shaxsiy ma’lumotlaringizni faqat siz
        bilan bog‘lanish va xizmat ko‘rsatish maqsadida qayta ishlaydi.
      </p>
      <h2>Qanday ma’lumotlarni yig‘amiz</h2>
      <ul>
        <li>Ism, telefon raqami, kompaniya nomi va xodimlar soni — ariza formasi orqali;</li>
        <li>Texnik ma’lumotlar: IP-manzil, brauzer turi, reklama manbasi (UTM) va cookie identifikatorlari.</li>
      </ul>
      <h2>Ma’lumotlardan qanday foydalanamiz</h2>
      <ul>
        <li>Siz bilan bog‘lanish va tanishuv qo‘ng‘irog‘ini tashkil etish;</li>
        <li>Arizalarni CRM tizimida (Bitrix24) yuritish va jamoamizni xabardor qilish (Telegram);</li>
        <li>
          Reklama samaradorligini o‘lchash — Meta Conversions API orqali (telefon raqami SHA-256 bilan shifrlangan holda).
          Batafsil: <Link href="/cookie-siyosati" className="text-navy underline">Cookie siyosati</Link>.
        </li>
      </ul>
      <h2>Ma’lumotlarni saqlash va himoya</h2>
      <p>
        Ma’lumotlaringiz uchinchi shaxslarga sotilmaydi. Ular faqat yuqorida ko‘rsatilgan xizmatlar orqali, himoyalangan
        ulanish (HTTPS) yordamida uzatiladi.
      </p>
      <h2>Huquqlaringiz</h2>
      <p>
        Siz o‘z ma’lumotlaringizni ko‘rish, tuzatish yoki o‘chirishni so‘rashingiz mumkin. Buning uchun{" "}
        <a href={`mailto:${brand.email}`} className="text-navy underline">{brand.email}</a> manziliga yoki {brand.phone} raqamiga murojaat qiling.
      </p>
    </LegalLayout>
  );
}

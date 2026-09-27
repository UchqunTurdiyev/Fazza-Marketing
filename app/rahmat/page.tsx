import type { Metadata } from "next";
import { ThankYou } from "./ThankYou";

export const metadata: Metadata = {
  title: "Rahmat! Arizangiz qabul qilindi — FAZZA",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}

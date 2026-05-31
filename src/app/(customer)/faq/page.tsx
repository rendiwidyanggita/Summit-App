import { FaqPageClient } from "@/components/sections/faq-page-client";

export const metadata = {
  title: "FAQ Summit Gear",
  description: "Pertanyaan umum tentang belanja, pembayaran, pengiriman, return, dan akun Summit Gear.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ Summit Gear",
    description: "Pertanyaan umum tentang belanja, pembayaran, pengiriman, return, dan akun Summit Gear.",
    type: "website",
  },
};

export default function FaqPage() {
  return <FaqPageClient />;
}

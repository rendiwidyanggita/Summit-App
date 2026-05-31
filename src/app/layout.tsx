import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Summit Gear",
    template: "%s | Summit Gear",
  },
  description: "Responsive web e-commerce peralatan pendakian untuk katalog, checkout, dan admin backoffice.",
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Summit Gear",
    description: "Peralatan pendakian, camping, dan outdoor untuk pendaki Indonesia.",
    siteName: "Summit Gear",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

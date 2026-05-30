import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  ["Apakah Summit Gear melayani rental?", "Tidak untuk MVP. PRD membatasi scope pada penjualan produk."],
  ["Apakah COD tersedia?", "Disiapkan sebagai metode rendah prioritas dengan limit dan pembatasan wilayah pada fase payment/order."],
  ["Apakah semua produk milik Summit Gear?", "Ya. Model bisnis B2C retail dengan Summit Gear sebagai satu-satunya penjual."],
];

export default function FaqPage() {
  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-semibold tracking-normal">FAQ</h1>
      <div className="mt-6 grid gap-4">
        {faqs.map(([question, answer]) => (
          <Card key={question}>
            <CardHeader>
              <CardTitle className="text-base">{question}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{answer}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

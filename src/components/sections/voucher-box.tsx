"use client";

import { useState } from "react";
import { TicketPercent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VoucherMock } from "@/lib/commerce-mock";
import { getVoucherByCode } from "@/lib/commerce-mock";
import { formatRupiah } from "@/lib/utils";

export function VoucherBox({
  subtotal,
  selectedVoucher,
  onApply,
}: {
  subtotal: number;
  selectedVoucher: VoucherMock | null;
  onApply: (voucher: VoucherMock | null) => void;
}) {
  const [code, setCode] = useState(selectedVoucher?.code ?? "");
  const [message, setMessage] = useState("Coba SUMMIT50 atau FREEONGKIR.");

  function applyVoucher() {
    const voucher = getVoucherByCode(code);

    if (!voucher) {
      onApply(null);
      setMessage("Kode voucher tidak ditemukan pada mock Sprint 4.");
      return;
    }

    if (subtotal < voucher.minSpend) {
      onApply(null);
      setMessage(`Minimum belanja ${formatRupiah(voucher.minSpend)} untuk voucher ini.`);
      return;
    }

    onApply(voucher);
    setMessage(`${voucher.label} diterapkan.`);
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 font-semibold">
        <TicketPercent className="size-4 text-primary" />
        Voucher
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="SUMMIT50" />
        <Button type="button" onClick={applyVoucher}>
          Pakai
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

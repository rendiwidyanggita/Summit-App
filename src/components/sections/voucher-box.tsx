"use client";

import { useState } from "react";
import { Loader2, TicketPercent, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VoucherValidationResponse } from "@/lib/commerce-types";
import { formatRupiah } from "@/lib/utils";

export function VoucherBox({
  selectedVoucher,
  message,
  loading,
  onApply,
  onClear,
}: {
  selectedVoucher: VoucherValidationResponse | null;
  message: string;
  loading?: boolean;
  onApply: (code: string) => void;
  onClear: () => void;
}) {
  const [code, setCode] = useState(selectedVoucher?.code ?? "");

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 font-semibold">
        <TicketPercent className="size-4 text-primary" />
        Voucher
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="SUMMIT50" disabled={loading} />
        <Button type="button" onClick={() => onApply(code)} disabled={loading || code.trim().length < 2}>
          {loading ? <Loader2 className="animate-spin" /> : null}
          Pakai
        </Button>
      </div>
      {selectedVoucher ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-secondary p-3 text-sm">
          <span>
            {selectedVoucher.code} diterapkan: -{formatRupiah(selectedVoucher.discount)}
          </span>
          <Button type="button" variant="ghost" size="icon" onClick={onClear} aria-label="Hapus voucher">
            <X />
          </Button>
        </div>
      ) : null}
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

"use client";

import type * as React from "react";
import { AlertTriangle, Info, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminMetricCard({
  title,
  value,
  note,
  icon: Icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

export function AdminStatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes("active") || normalized.includes("visible") || normalized.includes("dikirim") || normalized.includes("selesai")
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
    : normalized.includes("draft") || normalized.includes("scheduled") || normalized.includes("packing") || normalized.includes("diproses")
      ? "border-primary/30 bg-primary/10 text-primary"
      : normalized.includes("pending") || normalized.includes("bayar") || normalized.includes("paused")
        ? "border-accent/40 bg-accent/15 text-accent-foreground"
        : "border-muted-foreground/25 bg-secondary text-muted-foreground";

  return (
    <Badge variant="outline" className={tone}>
      {status}
    </Badge>
  );
}

export function AdminDataToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  options,
  placeholder = "Cari data admin...",
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.25rem] border bg-card p-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={placeholder} className="pl-9" aria-label="Cari data admin" />
      </div>
      <select
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        aria-label="Filter data admin"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminMockActionNotice({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-3 rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm", className)}>
      <Info className="mt-0.5 size-4 shrink-0 text-accent" />
      <p className="text-muted-foreground">Semua action pada Sprint 6 ini mock frontend. Tidak ada request API, mutation database, audit log, atau RBAC enforcement yang dijalankan.</p>
    </div>
  );
}

export function AdminLowStockFlag({ show }: { show: boolean }) {
  if (!show) {
    return <span className="text-xs text-muted-foreground">Stock aman</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent-foreground">
      <AlertTriangle className="size-3.5" />
      Low stock
    </span>
  );
}

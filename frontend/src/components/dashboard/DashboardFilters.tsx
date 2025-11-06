"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilterX } from "lucide-react";

export function DashboardFilters({ onApply }: { onApply: () => void }) {
  const { filters, setFilters, clearFilters } = useDashboardStore();

  return (
    <section className="flex flex-wrap items-center gap-3 justify-between mb-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.channel ?? ""}
          onValueChange={(v) => setFilters({ channel: v || undefined })}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue className="w-full" placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iFood">iFood</SelectItem>
            <SelectItem value="Rappi">Rappi</SelectItem>
            <SelectItem value="Presencial">Presencial</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeof filters.dow === "number" ? String(filters.dow) : ""}
          onValueChange={(v) => setFilters({ dow: v ? Number(v) : undefined })}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Dia da semana" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Domingo</SelectItem>
            <SelectItem value="1">Segunda</SelectItem>
            <SelectItem value="2">Terça</SelectItem>
            <SelectItem value="3">Quarta</SelectItem>
            <SelectItem value="4">Quinta</SelectItem>
            <SelectItem value="5">Sexta</SelectItem>
            <SelectItem value="6">Sábado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.hourFrom?.toString() ?? ""}
          onValueChange={(v) =>
            setFilters({ hourFrom: v ? Number(v) : undefined })
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Hora de" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, h) => (
              <SelectItem key={h} value={String(h)}>
                {`${h.toString().padStart(2, "0")}:00`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.hourTo?.toString() ?? ""}
          onValueChange={(v) =>
            setFilters({ hourTo: v ? Number(v) : undefined })
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Hora até" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, h) => (
              <SelectItem key={h} value={String(h)}>
                {`${h.toString().padStart(2, "0")}:00`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 w-full md:w-40">
          <div onClick={(e) => e.stopPropagation()} className="w-full md:w-40">
            <DateRangePicker
              value={{
                from: filters.period?.dateFrom
                  ? new Date(filters.period.dateFrom)
                  : undefined,
                to: filters.period?.dateTo
                  ? new Date(filters.period.dateTo)
                  : undefined,
              }}
              onChange={(range) => {
                if (range?.from && range?.to) {
                  const toIso = (d: Date) => d.toISOString().slice(0, 10);
                  setFilters({
                    period: {
                      dateFrom: toIso(range.from),
                      dateTo: toIso(range.to),
                    },
                  });
                } else {
                  setFilters({ period: undefined });
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="default" onClick={onApply}>
          Aplicar
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-1"
        >
          <FilterX className="h-4 w-4" />
          Limpar
        </Button>
      </div>

      <Separator className="w-full mt-2" />
    </section>
  );
}

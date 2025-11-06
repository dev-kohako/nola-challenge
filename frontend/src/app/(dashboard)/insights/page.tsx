"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, MapPin, Save } from "lucide-react";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useInsights } from "../../../hooks/useInsights";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function InsightsPage() {
  const { filters } = useDashboardStore();
  const {
    isLoading,
    refetchAll,
    insights,
    topProducts,
    deliveryTrend,
    lostCustomers,
    saveDashboard,
    loading
  } = useInsights(filters);

  const [dashboardName, setDashboardName] = useState("");

  const totalLost = lostCustomers.length;
  const totalLoyal = Math.floor(totalLost * 0.3);
  const totalRecovered = Math.floor(totalLost * 0.1);

const handleSaveDashboard = async () => {
  const ok = await saveDashboard(dashboardName);
  if (ok) setDashboardName("");
};

  return (
    <main className="py-6 w-full max-w-7xl mx-auto space-y-8 overflow-hidden">
      <header className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            📊 Insights Analíticos
          </h1>
          <p className="text-sm text-muted-foreground">
            Tendências automáticas e indicadores baseados nos dados recentes.
          </p>
        </div>

        <div className="flex flex-row items-end gap-3 w-full md:w-auto">
          <div className="flex flex-col w-full">
            <Label
              htmlFor="dashboard-name"
              className="text-sm font-medium text-muted-foreground"
            >
              Nome do dashboard
            </Label>
            <Input
              id="dashboard-name"
              placeholder="Digite um nome..."
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full lg:w-72 mt-1"
            />
          </div>

          <Button
            onClick={handleSaveDashboard}
            disabled={loading || !dashboardName.trim()}
            variant="default"
            aria-label="Salvar dashboard atual"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </header>

      <Separator className="block md:hidden w-full -mt-3 mb-5" />

      <DashboardFilters onApply={refetchAll} />

      {isLoading ? (
        <section
          aria-busy="true"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Clientes Fiéis"
            value={totalLoyal}
            icon={<Users className="h-5 w-5 text-blue-500" />}
          />
          <KpiCard
            title="Clientes Perdidos"
            value={totalLost}
            icon={<Users className="h-5 w-5 text-red-500" />}
          />
          <KpiCard
            title="Clientes Recuperados"
            value={totalRecovered}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          />
          <KpiCard
            title="Regiões Atendidas"
            value={deliveryTrend.length}
            icon={<MapPin className="h-5 w-5" />}
          />
        </section>
      )}

      {topProducts.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardCard
            title="Top Produtos"
            subtitle="Produtos mais vendidos no período"
          >
            <BarChart
              data={topProducts.slice(0, 5)}
              xKey="product_id"
              bars={[{ key: "faturamento", name: "Faturamento (R$)" }]}
              height={350}
            />
          </DashboardCard>
        </motion.section>
      ) : (
        !isLoading && (
          <DashboardCard
            title="Top Produtos"
            subtitle="Nenhum dado disponível no período selecionado."
          >
            <p className="text-sm text-muted-foreground text-center py-10">
              📉 Sem vendas registradas nesse intervalo.
            </p>
          </DashboardCard>
        )
      )}

      {deliveryTrend.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardCard
            title="Tendência por Região"
            subtitle="Tempo médio de entrega por região (em minutos)"
          >
            <LineChart
              data={deliveryTrend}
              xKey="delivery_region"
              lines={[
                { key: "avg_prev", name: "Período Anterior" },
                { key: "avg_cur", name: "Período Atual" },
              ]}
              height={350}
            />
          </DashboardCard>
        </motion.section>
      ) : (
        !isLoading && (
          <DashboardCard
            title="Tendência por Região"
            subtitle="Nenhum dado disponível no período."
          >
            <p className="text-sm text-muted-foreground text-center py-10">
              🚚 Sem registros de entregas nesse intervalo.
            </p>
          </DashboardCard>
        )
      )}

      {insights.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4"
        >
          {insights.map((i: any, idx: number) => (
            <DashboardCard
              key={idx}
              title={`Insight ${idx + 1}`}
              subtitle="Gerado automaticamente com base nos últimos 30 dias"
            >
              <p
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: i.message }}
              />
            </DashboardCard>
          ))}
        </motion.section>
      )}
    </main>
  );
}

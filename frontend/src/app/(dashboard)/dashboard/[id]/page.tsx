"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, RefreshCcw } from "lucide-react";
import { useDashboardById } from "../../../../hooks/useDashboardById";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DashboardChart } from "@/components/charts/DashboardChart";
import { formatDateSmart } from "@/lib/utils";

export default function DashboardDetailsPage() {
  const { id } = useParams();
  const dashboardId = Number(id);
  const { dashboard, loading, error, refetch, copyLink } =
    useDashboardById(dashboardId);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-8 w-1/2 md:w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p className="text-destructive font-medium mb-4">
          Erro ao carregar dashboard: {error.message}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Tentar novamente
        </Button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-4 md:p-6 text-center text-muted-foreground">
        Dashboard não encontrado.
      </div>
    );
  }

  return (
    <main className="py-6 w-full max-w-7xl mx-auto space-y-8 overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-center sm:text-left">
          {dashboard.name}
        </h1>
        <div className="space-x-2 space-y-4">
                  <Button
          onClick={() => refetch()}
          className="self-center sm:self-auto w-full sm:w-auto"
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Atualizar
        </Button>
        <Button variant="outline" className="self-center sm:self-auto w-full sm:w-auto" onClick={copyLink}>
          <Copy className="w-4 h-4 mr-2" /> Copiar link
        </Button>
        </div>
      </header>

      <DashboardChart dashboard={dashboard} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Configuração</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <pre className="text-xs sm:text-sm bg-muted p-3 sm:p-4 rounded-md min-w-full">
            {JSON.stringify(dashboard.config, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
        Criado em: {formatDateSmart(dashboard.created_at)}
      </p>
    </main>
  );
}

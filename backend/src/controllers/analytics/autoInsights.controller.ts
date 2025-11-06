import prisma from "../../lib/prisma";
import {
  AutoInsight,
  ChannelRow,
  DeliveryRow,
  ProductRow,
  TotalRevenueRow,
} from "../../types/autoInsights.types";

export const getAutoInsights = async (): Promise<AutoInsight[]> => {
  const insights: AutoInsight[] = [];

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(v);

  try {
    const [total, channel, product, delivery] = await prisma.$transaction([
      prisma.$queryRaw<TotalRevenueRow[]>`
        SELECT
          SUM(CASE WHEN sold_date BETWEEN current_date - interval '30 days' AND current_date THEN revenue ELSE 0 END) AS cur,
          SUM(CASE WHEN sold_date BETWEEN current_date - interval '60 days' AND current_date - interval '30 days' THEN revenue ELSE 0 END) AS prev
        FROM mv_sales_fact;
      `,
      prisma.$queryRaw<ChannelRow[]>`
        SELECT channel AS name, SUM(revenue) AS total
        FROM mv_sales_fact
        WHERE sold_date >= current_date - interval '30 days'
        GROUP BY channel
        ORDER BY total DESC
        LIMIT 1;
      `,
      prisma.$queryRaw<ProductRow[]>`
        SELECT product_name, SUM(revenue) AS total
        FROM mv_sales_fact
        WHERE sold_date >= current_date - interval '30 days'
        GROUP BY product_name
        ORDER BY total DESC
        LIMIT 1;
      `,
      prisma.$queryRaw<DeliveryRow[]>`
        SELECT AVG(delivery_minutes) AS avg_cur
        FROM mv_sales_fact
        WHERE sold_date >= current_date - interval '30 days';
      `,
    ]);

    if (total?.[0]) {
      const cur = Number(total[0].cur ?? 0);
      const prev = Number(total[0].prev ?? 1);
      const safePrev = prev <= 0 ? 1 : prev;
      const delta = ((cur - safePrev) / safePrev) * 100;

      insights.push({
        message:
          delta >= 0
            ? `📈 As vendas totais cresceram ${delta.toFixed(
                1
              )}% nos últimos 30 dias.`
            : `📉 As vendas caíram ${Math.abs(delta).toFixed(
                1
              )}% nos últimos 30 dias.`,
        type: "sales",
      });
    }

    if (channel?.[0]) {
      insights.push({
        message: `🥇 O canal com melhor desempenho foi **${
          channel[0].name
        }**, com ${fmt(Number(channel[0].total))} de faturamento.`,
        type: "channel",
      });
    }

    if (product?.[0]) {
      insights.push({
        message: `🍕 O produto mais vendido foi **${
          product[0].product_name
        }**, gerando ${fmt(Number(product[0].total))} em receita.`,
        type: "product",
      });
    }

    if (delivery?.[0]?.avg_cur) {
      insights.push({
        message: `🚚 O tempo médio de entrega no último mês foi de ${Number(
          delivery[0].avg_cur
        ).toFixed(1)} minutos.`,
        type: "delivery",
      });
    }

    return insights;
  } catch (err) {
    console.error("Erro ao gerar auto-insights:", err);
    throw err;
  }
};

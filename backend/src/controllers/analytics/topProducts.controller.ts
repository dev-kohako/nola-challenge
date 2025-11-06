import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { TopProduct, TopProductsInput } from "../../types/topProducts.types";
import { AppError } from "../../utils/errors";

export async function getTopProducts(
  input: TopProductsInput
): Promise<TopProduct[]> {
  const { channel, dow, hourFrom = 0, hourTo = 23, period } = input ?? {};

  if (!period?.dateFrom || !period?.dateTo)
    throw new AppError("O período (dateFrom e dateTo) é obrigatório.", 400);

  const prevFrom = period.prevDateFrom ?? period.dateFrom;
  const prevTo = period.prevDateTo ?? period.dateTo;

  try {
    const dowClause =
      typeof dow === "number"
        ? Prisma.sql`EXTRACT(DOW FROM sold_date) = ${dow}`
        : Prisma.sql`TRUE`;

    const [cur, prev] = await Promise.all([
      prisma.$queryRaw<TopProduct[]>`
        SELECT product_id,
               SUM(quantity) AS total_itens,
               SUM(revenue) AS faturamento
        FROM mv_sales_fact
        WHERE sold_date BETWEEN ${period.dateFrom}::timestamp AND ${period.dateTo}::timestamp
          AND (${channel ? Prisma.sql`channel = ${channel}` : Prisma.sql`TRUE`})
          AND (${dowClause})
          AND hour_of_day BETWEEN ${hourFrom} AND ${hourTo}
        GROUP BY product_id
        ORDER BY faturamento DESC
        LIMIT 50;
      `,
      prisma.$queryRaw<TopProduct[]>`
        SELECT product_id, SUM(revenue) AS faturamento_prev
        FROM mv_sales_fact
        WHERE sold_date BETWEEN ${prevFrom}::timestamp AND ${prevTo}::timestamp
          AND (${channel ? Prisma.sql`channel = ${channel}` : Prisma.sql`TRUE`})
          AND (${dowClause})
          AND hour_of_day BETWEEN ${hourFrom} AND ${hourTo}
        GROUP BY product_id;
      `,
    ]);

    return cur.map((p) => {
      const prevMatch = prev.find((x) => x.product_id === p.product_id);
      const faturamento_prev = Number(prevMatch?.faturamento_prev ?? 0);
      const faturamento = Number(p.faturamento ?? 0);
      const delta_percent = faturamento_prev
        ? ((faturamento - faturamento_prev) / faturamento_prev) * 100
        : 0;

      return {
        product_id: p.product_id,
        total_itens: Number(p.total_itens ?? 0),
        faturamento,
        faturamento_prev,
        delta_percent: Number(delta_percent.toFixed(2)),
      };
    });
  } catch (err) {
    console.error("❌ Erro em getTopProducts:", err);
    throw new AppError("Erro ao buscar produtos mais vendidos", 500, err);
  }
}

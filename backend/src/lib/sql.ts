import { z } from "zod";
import { AppError } from "../utils/errors";
import { PivotInput as PivotSchema } from "../validation/analytics.zod";

type PivotInput = z.infer<typeof PivotSchema>;

const DIMENSIONS = new Set([
  "store_id",
  "channel",
  "product_id",
  "customer_id",
  "sold_date",
  "dow",
  "hour_of_day",
  "delivery_region",
]);

const MEASURE_FUNS = new Set(["sum", "avg", "count", "count_distinct"]);

const MEASURE_FIELDS = new Set([
  "revenue",
  "quantity",
  "sale_id",
  "customer_id",
  "delivery_minutes",
]);

const safeIdent = (id: string, allow: Set<string>, kind: "dim" | "measure") => {
  if (!allow.has(id)) {
    throw new AppError(`Campo ${kind} não permitido: ${id}`, 400);
  }
  return id;
};

export function buildPivotSQL(input: PivotInput) {
  try {
    const dims = (input.dimensions ?? []).map((d) =>
      safeIdent(d, DIMENSIONS, "dim")
    );

    const measuresSql = input.measures.map((m) => {
      const fn = m.fn.toLowerCase();
      const field = m.field.toLowerCase();

      if (!MEASURE_FUNS.has(fn))
        throw new AppError(`Função de agregação não permitida: ${fn}`, 400);
      if (!MEASURE_FIELDS.has(field))
        throw new AppError(`Campo de métrica não permitido: ${field}`, 400);

      const alias = m.alias ?? `${fn}_${field}`;

      switch (fn) {
        case "count_distinct":
          return `COUNT(DISTINCT ${field}) AS "${alias}"`;
        case "count":
          return `COUNT(${field === "sale_id" ? "sale_id" : "*"}) AS "${alias}"`;
        default:
          return `${fn}(${field}) AS "${alias}"`;
      }
    });

    const values: unknown[] = [];
    const filtersSql: string[] = [];
    let vi = 1;

    for (const f of input.filters ?? []) {
      const field =
        DIMENSIONS.has(f.field) || MEASURE_FIELDS.has(f.field)
          ? f.field
          : null;

      if (!field) {
        throw new AppError(`Filtro inválido: ${f.field}`, 400);
      }

      switch (f.op) {
        case "between": {
          if (!Array.isArray(f.value) || f.value.length !== 2) {
            throw new AppError("Operador 'between' exige [a, b].", 400);
          }
          filtersSql.push(`${field} BETWEEN $${vi} AND $${vi + 1}`);
          values.push(f.value[0], f.value[1]);
          vi += 2;
          break;
        }
        case "in": {
          if (!Array.isArray(f.value) || f.value.length === 0) {
            throw new AppError("Operador 'in' exige lista de valores.", 400);
          }
          const placeholders = f.value.map(() => `$${vi++}`).join(", ");
          filtersSql.push(`${field} IN (${placeholders})`);
          values.push(...f.value);
          break;
        }
        case "like": {
          filtersSql.push(`${field} ILIKE $${vi}`);
          values.push(`%${f.value}%`);
          vi++;
          break;
        }
        default: {
          filtersSql.push(`${field} ${f.op} $${vi}`);
          values.push(f.value);
          vi++;
        }
      }
    }

    if (input.dateRange?.from) {
      filtersSql.push(`sold_date >= $${vi}`);
      values.push(input.dateRange.from);
      vi++;
    }
    if (input.dateRange?.to) {
      filtersSql.push(`sold_date <= $${vi}`);
      values.push(input.dateRange.to);
      vi++;
    }

    const whereSql = filtersSql.length ? `WHERE ${filtersSql.join(" AND ")}` : "";
    const groupSql = dims.length ? `GROUP BY ${dims.join(", ")}` : "";
    const orderSql = dims.length
      ? dims.join(", ")
      : measuresSql[0].split(" AS ")[0];

    const limit = Math.min(input.limit ?? 100, 1000);

    const sql = `
      SELECT
        ${dims.length ? dims.join(", ") + ", " : ""}
        ${measuresSql.join(", ")}
      FROM mv_sales_fact
      ${whereSql}
      ${groupSql}
      ORDER BY ${orderSql} DESC
      LIMIT ${limit};
    `;

    if (process.env.NODE_ENV === "development") {
      console.log("🧩 Pivot SQL built:", sql, values);
    }

    return { sql, values };
  } catch (err) {
    throw new AppError("Erro ao gerar SQL de pivot", 400, err);
  }
}

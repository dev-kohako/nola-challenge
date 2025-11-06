export interface TopProduct {
  product_id: number;
  total_itens: number;
  faturamento: number;
  faturamento_prev: number;
  delta_percent: number;
}

export interface RegionTrendInput {
  period: {
    dateFrom: string;
    dateTo: string;
    prevDateFrom?: string;
    prevDateTo?: string;
  };
}

export interface TopProductsInput {
  channel?: string;
  dow?: number;
  hourFrom?: number;
  hourTo?: number;
  period: {
    dateFrom: string;
    dateTo: string;
    prevDateFrom?: string;
    prevDateTo?: string;
  };
}
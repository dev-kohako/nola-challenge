export type DashboardLine = {
  key: string;
  name: string;
  color?: string;
};

export type DashboardDataPoint = Record<string, string | number>;

export type DashboardConfig = {
  chartTitle: string;
  type: "bar" | "line" | "area" | "pie";
  xKey: string;
  lines: DashboardLine[];
  data: DashboardDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
};


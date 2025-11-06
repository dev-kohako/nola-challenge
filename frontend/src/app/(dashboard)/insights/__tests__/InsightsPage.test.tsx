import { render, screen, fireEvent, act } from "@testing-library/react";
import InsightsPage from "../page";
import React from "react";

jest.mock("@/store/useDashboardStore", () => ({
  useDashboardStore: () => ({ filters: {} }),
}));

jest.mock("framer-motion", () => ({
  motion: {
    section: ({ children }: { children: React.ReactNode }) => (
      <section>{children}</section>
    ),
  },
}));

jest.mock("@/hooks/useInsights", () => ({
  useInsights: jest.fn(),
}));
const mockUseInsights = require("@/hooks/useInsights").useInsights;

jest.mock("@/components/dashboard/DashboardCard", () => ({
  DashboardCard: ({ title, subtitle, children }: any) => (
    <div data-testid="dashboard-card">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <div>{children}</div>
    </div>
  ),
}));

jest.mock("@/components/dashboard/KpiCard", () => ({
  KpiCard: ({ title, value }: any) => (
    <div data-testid="kpi-card">
      {title}: {value}
    </div>
  ),
}));

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock("@/components/dashboard/DashboardFilters", () => ({
  DashboardFilters: ({ onApply }: any) => (
    <button data-testid="dashboard-filters" onClick={onApply}>
      Apply Filters
    </button>
  ),
}));

jest.mock("@/components/charts/BarChart", () => ({
  BarChart: ({ data }: any) => (
    <div data-testid="bar-chart">{`BarChart (${data.length})`}</div>
  ),
}));

jest.mock("@/components/charts/LineChart", () => ({
  LineChart: ({ data }: any) => (
    <div data-testid="line-chart">{`LineChart (${data.length})`}</div>
  ),
}));

describe("InsightsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header and base elements", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);

    expect(
      screen.getByRole("heading", { name: /insights analíticos/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-filters")).toBeInTheDocument();
  });

  it("renders loading skeletons when isLoading is true", () => {
    mockUseInsights.mockReturnValue({
      isLoading: true,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders KPI cards when data is available", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [{ delivery_region: "Sul", avg_cur: 5, avg_prev: 4 }],
      lostCustomers: [{ id: 1 }, { id: 2 }, { id: 3 }],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis.length).toBeGreaterThan(0);
    expect(screen.getByText(/Clientes Fiéis/i)).toBeInTheDocument();
  });

  it("renders top products chart when data exists", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [{ product_id: 1, faturamento: 200 }],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renders fallback when no topProducts exist", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    expect(screen.getByText(/sem vendas registradas/i)).toBeInTheDocument();
  });

  it("renders delivery trend chart when data exists", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [{ delivery_region: "Norte", avg_cur: 3, avg_prev: 4 }],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("renders fallback when no delivery trend data", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    expect(screen.getByText(/sem registros de entregas/i)).toBeInTheDocument();
  });

  it("renders insights when data exists", () => {
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [{ message: "Insight A" }, { message: "Insight B" }],
      topProducts: [],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard: jest.fn(),
    });

    render(<InsightsPage />);
    expect(screen.getAllByText(/Insight/i).length).toBeGreaterThan(0);
  });

  it("calls saveDashboard when clicking save", async () => {
    const saveDashboard = jest.fn().mockResolvedValue(true);
    mockUseInsights.mockReturnValue({
      isLoading: false,
      loading: false,
      refetchAll: jest.fn(),
      insights: [],
      topProducts: [],
      deliveryTrend: [],
      lostCustomers: [],
      saveDashboard,
    });

    render(<InsightsPage />);

    const input = screen.getByLabelText(/nome do dashboard/i);
    fireEvent.change(input, { target: { value: "Meu Dashboard" } });

    const button = screen.getByRole("button", {
      name: /salvar dashboard atual/i,
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(saveDashboard).toHaveBeenCalledWith("Meu Dashboard");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import DashboardDetailsPage from "../[id]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

jest.mock("@/hooks/useDashboardById", () => ({
  useDashboardById: jest.fn(),
}));
const mockUseDashboardById =
  require("@/hooks/useDashboardById").useDashboardById;

jest.mock("@/components/charts/DashboardChart", () => ({
  DashboardChart: ({ dashboard }: any) => (
    <div data-testid="dashboard-chart">Chart for {dashboard.name}</div>
  ),
}));

describe("DashboardDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders skeleton when loading", () => {
    mockUseDashboardById.mockReturnValue({
      dashboard: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
      copyLink: jest.fn(),
    });

    render(<DashboardDetailsPage />);
    const skeletons = screen.getAllByRole("generic", { hidden: true });
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state correctly", () => {
    mockUseDashboardById.mockReturnValue({
      dashboard: null,
      loading: false,
      error: { message: "Falha" },
      refetch: jest.fn(),
      copyLink: jest.fn(),
    });

    render(<DashboardDetailsPage />);
    expect(screen.getByText(/erro ao carregar dashboard/i)).toBeInTheDocument();
  });

  it("renders not found message when dashboard is null", () => {
    mockUseDashboardById.mockReturnValue({
      dashboard: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      copyLink: jest.fn(),
    });

    render(<DashboardDetailsPage />);
    expect(screen.getByText(/dashboard não encontrado/i)).toBeInTheDocument();
  });

  it("renders dashboard details correctly", () => {
    mockUseDashboardById.mockReturnValue({
      dashboard: {
        id: 1,
        name: "Relatório Semanal",
        config: { chartType: "bar" },
        created_at: "2025-11-05T00:00:00Z",
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
      copyLink: jest.fn(),
    });

    render(<DashboardDetailsPage />);

    expect(
      screen.getByRole("heading", { name: /relatório semanal/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/configuração/i)).toBeInTheDocument();
    expect(screen.getByText(/criado em/i)).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-chart")).toBeInTheDocument();
  });

  it("handles refresh button click", () => {
    const refetch = jest.fn();
    mockUseDashboardById.mockReturnValue({
      dashboard: {
        id: 1,
        name: "Relatório Semanal",
        config: {},
        created_at: "2025-11-05T00:00:00Z",
      },
      loading: false,
      error: null,
      refetch,
      copyLink: jest.fn(),
    });

    render(<DashboardDetailsPage />);
    fireEvent.click(screen.getByRole("button", { name: /atualizar/i }));
    expect(refetch).toHaveBeenCalled();
  });
});

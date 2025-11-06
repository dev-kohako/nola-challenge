import { renderHook, act } from "@testing-library/react";
import { useDashboardById } from "../useDashboardById";
import { useQuery } from "@apollo/client/react";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
}));
jest.mock("sonner", () => ({ toast: { success: jest.fn() } }));

describe("useDashboardById", () => {
  beforeEach(() => {
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: { dashboard: { id: 1, name: "Test" } },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });
    Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
  });

  it("returns dashboard data correctly", () => {
    const { result } = renderHook(() => useDashboardById(1));
    expect(result.current.dashboard?.name).toBe("Test");
  });

  it("copies link successfully", () => {
    const { result } = renderHook(() => useDashboardById(1));
    act(() => result.current.copyLink());
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});

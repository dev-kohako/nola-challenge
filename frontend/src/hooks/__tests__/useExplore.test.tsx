import { renderHook, act } from "@testing-library/react";
import { useExplore } from "../useExplore";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";

jest.mock("@apollo/client/react", () => ({
  useLazyQuery: jest.fn(),
  useMutation: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));
jest.mock("@/lib/utils", () => ({
  getPrevRange: jest.fn(() => ({ prevFrom: "2025-01-01", prevTo: "2025-01-02" })),
}));

describe("useExplore", () => {
  const runPivot = jest.fn();
  const runPivotPrev = jest.fn();

  beforeEach(() => {
    (useLazyQuery as unknown as jest.Mock)
      .mockReturnValueOnce([runPivot, { data: { pivot: { rows: [] } }, loading: false }])
      .mockReturnValueOnce([runPivotPrev, { loading: false }]);
    (useMutation as unknown as jest.Mock).mockReturnValue([jest.fn().mockResolvedValue({ data: { saveDashboard: true } }), { loading: false }]);
  });

  it("calls handleRun without compare", async () => {
    const { result } = renderHook(() => useExplore());
    await act(async () => {
      await result.current.handleRun(false);
    });
    expect(runPivot).toHaveBeenCalled();
  });

  it("calls saveAsDashboard successfully", async () => {
    const { result } = renderHook(() => useExplore());
    await act(async () => {
      await result.current.saveAsDashboard("My Dashboard");
    });
    expect(toast.success).toHaveBeenCalled();
  });
});

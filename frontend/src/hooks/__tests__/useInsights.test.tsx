import { renderHook, act } from "@testing-library/react";
import { useInsights } from "../useInsights";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

describe("useInsights", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useQuery as unknown as jest.Mock)
      .mockReturnValueOnce({
        data: { autoInsights: [] },
        loading: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { topProducts: [] },
        loading: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { deliveryRegionTrend: [] },
        loading: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { lostButLoyal: [] },
        loading: false,
        refetch: jest.fn(),
      });

    (useMutation as unknown as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue({ data: { saveDashboard: true } }),
      { loading: false },
    ]);
  });

  it("refetches all successfully", async () => {
    const { result } = renderHook(() => useInsights({}));

    await act(async () => {
      await result.current.refetchAll();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("calls saveDashboard successfully", async () => {
    const { result } = renderHook(() => useInsights({}));

    await act(async () => {
      const ok = await result.current.saveDashboard("Meu Dashboard");
      expect(ok).toBe(true);
    });

    expect(toast.success).toHaveBeenCalledWith("Dashboard salvo com sucesso!");
  });
});

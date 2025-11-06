import { renderHook, act } from "@testing-library/react";
import { useSaveDashboard } from "../useSaveDashboard";
import { useMutation } from "@apollo/client/react";

jest.mock("@apollo/client/react", () => ({
  useMutation: jest.fn(),
}));

describe("useSaveDashboard", () => {
  const mutate = jest.fn().mockResolvedValue({ data: { saveDashboard: { id: 1 } } });

  beforeEach(() => {
    (useMutation as unknown as jest.Mock).mockReturnValue([mutate, { loading: false, error: null }]);
  });

  it("saves dashboard successfully", async () => {
    const { result } = renderHook(() => useSaveDashboard());
    const output = await act(async () => await result.current.saveDashboard("Test", {}));
    expect(mutate).toHaveBeenCalled();
  });
});

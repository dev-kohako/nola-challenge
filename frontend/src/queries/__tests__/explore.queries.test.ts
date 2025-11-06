import { GET_PIVOT, GET_PIVOT_FIELD_VALUES } from "../explore.queries";

describe("Explore GraphQL Queries", () => {
  it("GET_PIVOT should contain pivot query", () => {
    const query = GET_PIVOT.loc?.source.body;
    expect(query).toContain("query Pivot");
    expect(query).toContain("pivot(input: $input)");
    expect(query).toContain("sql");
    expect(query).toContain("rows");
  });

  it("GET_PIVOT_FIELD_VALUES should request field values", () => {
    const query = GET_PIVOT_FIELD_VALUES.loc?.source.body;
    expect(query).toContain("query GetPivotFieldValues");
    expect(query).toContain("pivotFieldValues(input: $input)");
  });
});

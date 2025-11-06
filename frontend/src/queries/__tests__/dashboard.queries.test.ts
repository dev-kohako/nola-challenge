import { GET_DASHBOARD_BY_ID, GET_DASHBOARDS } from "../dashboard.queries";

describe("Dashboard GraphQL Queries", () => {
  it("GET_DASHBOARD_BY_ID should match expected structure", () => {
    const query = GET_DASHBOARD_BY_ID.loc?.source.body;
    expect(query).toContain("query GetDashboardById");
    expect(query).toContain("dashboard(id: $id)");
    expect(query).toContain("id");
    expect(query).toContain("name");
    expect(query).toContain("config");
  });

  it("GET_DASHBOARDS should fetch dashboard list", () => {
    const query = GET_DASHBOARDS.loc?.source.body;
    expect(query).toContain("query GetDashboards");
    expect(query).toContain("dashboards");
    expect(query).toContain("name");
    expect(query).toContain("created_at");
  });
});

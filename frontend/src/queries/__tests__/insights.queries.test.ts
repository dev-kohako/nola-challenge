import {
  GET_AUTO_INSIGHTS,
  GET_TOP_PRODUCTS,
  GET_DELIVERY_REGION_TREND,
  GET_LOST_BUT_LOYAL,
  SAVE_DASHBOARD,
} from "../insights.queries";

describe("Insights GraphQL Queries", () => {
  it("GET_AUTO_INSIGHTS should fetch messages", () => {
    const query = GET_AUTO_INSIGHTS.loc?.source.body;
    expect(query).toContain("query GetAutoInsights");
    expect(query).toContain("autoInsights");
    expect(query).toContain("message");
  });

  it("GET_TOP_PRODUCTS should fetch product data", () => {
    const query = GET_TOP_PRODUCTS.loc?.source.body;
    expect(query).toContain("query GetTopProducts");
    expect(query).toContain("topProducts");
    expect(query).toContain("product_id");
    expect(query).toContain("faturamento");
  });

  it("GET_DELIVERY_REGION_TREND should include region metrics", () => {
    const query = GET_DELIVERY_REGION_TREND.loc?.source.body;
    expect(query).toContain("query GetDeliveryRegionTrend");
    expect(query).toContain("deliveryRegionTrend");
    expect(query).toContain("delivery_region");
    expect(query).toContain("delta_percent");
  });

  it("GET_LOST_BUT_LOYAL should fetch lost loyal customers", () => {
    const query = GET_LOST_BUT_LOYAL.loc?.source.body;
    expect(query).toContain("query GetLostButLoyal");
    expect(query).toContain("lostButLoyal");
    expect(query).toContain("customer_id");
  });

  it("SAVE_DASHBOARD should be a valid mutation", () => {
    const query = SAVE_DASHBOARD.loc?.source.body;
    expect(query).toContain("mutation SaveDashboard");
    expect(query).toContain("saveDashboard(input: $input)");
    expect(query).toContain("config");
    expect(query).toContain("created_at");
  });
});

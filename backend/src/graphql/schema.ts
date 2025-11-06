import gql from "graphql-tag";

export const typeDefs = gql`
  scalar JSON

  type Dashboard {
    id: ID!
    name: String!
    config: JSON
    created_at: String
  }

  input SaveDashboardInput {
    name: String!
    config: JSON!
  }

  type DeliveryRegionTrend {
    delivery_region: String!
    avg_prev: Float
    avg_cur: Float
    delta_min: Float
    delta_percent: Float
  }

  input DeliveryRegionTrendInput {
    period: PeriodInput!
  }

  type LostCustomer {
    customer_id: ID!
    n_orders: Int!
    last_date: String!
  }

  type ProductAgg {
    product_id: ID!
    total_itens: Int!
    faturamento: Float!
    faturamento_prev: Float
    delta_percent: Float
  }

  input TopProductsInput {
    channel: String
    dow: Int
    hourFrom: Int
    hourTo: Int
    period: PeriodInput!
  }

  type Query {
    dashboards: [Dashboard!]!
    dashboard(id: Int!): Dashboard
    deliveryRegionTrend(
      input: DeliveryRegionTrendInput!
    ): [DeliveryRegionTrend!]!
    lostButLoyal: [LostCustomer!]!
    topProducts(input: TopProductsInput!): [ProductAgg!]!
  }

  type Mutation {
    saveDashboard(input: SaveDashboardInput!): Dashboard
  }
`;

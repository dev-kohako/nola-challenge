import { gql } from "@apollo/client";

export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: Int!) {
    dashboard(id: $id) {
      id
      name
      config
      created_at
    }
  }
`;

export const GET_DASHBOARDS = gql`
  query GetDashboards {
    dashboards {
      id
      name
      created_at
    }
  }
`;
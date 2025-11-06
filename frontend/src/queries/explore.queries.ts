import { gql } from "@apollo/client";

export const GET_PIVOT = gql`
  query Pivot($input: PivotInput!) {
    pivot(input: $input) {
      sql
      rows
    }
  }
`;

export const GET_PIVOT_FIELD_VALUES = gql`
  query GetPivotFieldValues($input: PivotFieldValuesInput!) {
    pivotFieldValues(input: $input)
  }
`;
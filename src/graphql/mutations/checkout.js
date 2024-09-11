import { gql } from '@apollo/client';

export const CHECKOUT = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      success
      message
      orderId
      transactionId
    }
  }
`;
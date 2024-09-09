import { gql } from '@apollo/client';

export const GET_CART = gql`
  query GetCart($userId: ID!) {
    cart(userId: $userId) {
      productId
      quantity
    }
  }
`;
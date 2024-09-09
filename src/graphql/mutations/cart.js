import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation addToCart($productId: ID!, $quantity: Int!, $userId: ID!) {
    addToCart(productId: $productId, quantity: $quantity, userId: $userId) {
      productId
      quantity
      userId
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation removeFromCart($productId: ID!, $quantity: Int!, $userId: ID!) {
    removeFromCart(productId: $productId, quantity: $quantity, userId: $userId) {
      productId
      quantity
      userId
    }
  }
`;

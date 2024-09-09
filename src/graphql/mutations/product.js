import { gql } from '@apollo/client';

export const ADD_PRODUCT = gql`
  mutation addProduct(
    $name: String!
    $description: String
    $price: Int!
    $quantity: Int!
    $categoryId: ID
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      quantity: $quantity
      categoryId: $categoryId
    ) {
      id
      name
      description
      price
      quantity
      category {
        id
        name
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct(
    $id: ID!
    $name: String
    $description: String
    $price: Int
    $quantity: Int
    $categoryId: ID
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      quantity: $quantity
      categoryId: $categoryId
    ) {
      id
      name
      description
      price
      quantity
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
      description
      price
      quantity
      category {
        id
        name
      }
    }
  }
`;
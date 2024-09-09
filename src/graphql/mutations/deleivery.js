import { gql } from '@apollo/client';

export const ADD_DELIVERY_BOY = gql`
  mutation AddDeliveryBoy($name: String!, $phone: String!) {
    addDeliveryBoy(name: $name, phone: $phone) {
      id
      name
      phone
      status
    }
  }
`;

export const ASSIGN_DELIVERY = gql`
  mutation AssignDelivery($orderId: ID!, $deliveryBoyId: ID!) {
    assignDelivery(orderId: $orderId, deliveryBoyId: $deliveryBoyId) {
      success
      message
      order {
        id
        status
        assignedTo {
          id
          name
          status
        }
      }
    }
  }
`;

export const DELETE_DELIVERY_BOY = gql`
  mutation DeleteDeliveryBoy($id: ID!) {
    deleteDeliveryBoy(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_DELIVERY_STATUS = gql`
  mutation UpdateDeliveryStatus($orderId: ID!) {
    updateDeliveryStatus(orderId: $orderId) {
      success
      message
      order {
        id
        delivery
        assignedTo {
          id
          status
        }
      }
    }
  }
`;

export const CANCEL_ASSIGNMENT = gql`
  mutation CancelAssignment($orderId: ID!) {
    cancelAssignment(orderId: $orderId) {
      success
      message
      order {
        id
        delivery
        assignedTo {
          id
          status
        }
      }
    }
  }
`;
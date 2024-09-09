import { gql } from '@apollo/client';

export const GET_PENDING_ORDERS = gql`
  query GetPendingOrders {
    pendingOrders {
      id
      orderNumber
      total
      status
      delivery
      createdAt
    }
  }
`;

export const GET_ASSIGNED_ORDERS = gql`
  query GetAssignedOrders {
    assignedOrders {
      id
      orderNumber
      total
      status
      delivery
      createdAt
      assignedTo {
        id
        name
        phone
        status
      }
    }
  }
`;

export const GET_COMPLETED_ORDERS = gql`
  query GetCompletedOrders {
    completedOrders {
      id
      orderNumber
      total
      status
      delivery
      createdAt
      assignedTo {
        id
        name
        phone
        status
      }
    }
  }
`;

export const GET_DELIVERY_BOYS = gql`
  query GetDeliveryBoys {
    deliveryBoys {
      id
      name
      phone
      status
    }
  }
`;

export const GET_DELIVERY_HISTORY = gql`
  query GetDeliveryHistory($deliveryBoyId: ID!) {
    getDeliveryHistory(deliveryBoyId: $deliveryBoyId) {
      id
      orderNumber
      deliveryDate
      orderTotal
    }
  }
`;

export const GET_DELIVERY_HISTORY_SUMMARY = gql`
  query GetDeliveryHistorySummary($deliveryBoyId: ID!) {
    getDeliveryHistorySummary(deliveryBoyId: $deliveryBoyId) {
      totalDeliveries
      totalEarnings
    }
  }
`;
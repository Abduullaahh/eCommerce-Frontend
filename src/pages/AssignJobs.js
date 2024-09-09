import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PENDING_ORDERS, GET_ASSIGNED_ORDERS, GET_COMPLETED_ORDERS, GET_DELIVERY_BOYS, GET_DELIVERY_HISTORY, GET_DELIVERY_HISTORY_SUMMARY } from '../graphql/queries/deleivery';
import { ASSIGN_DELIVERY, DELETE_DELIVERY_BOY, ADD_DELIVERY_BOY, UPDATE_DELIVERY_STATUS, CANCEL_ASSIGNMENT } from '../graphql/mutations/deleivery';
import { format } from 'date-fns';

const AssignJobs = () => {
  const [activeSection, setActiveSection] = useState('NOT');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);
  const [newDeliveryBoyName, setNewDeliveryBoyName] = useState('');
  const [newDeliveryBoyPhone, setNewDeliveryBoyPhone] = useState('');

  const { data: pendingData } = useQuery(GET_PENDING_ORDERS);
  const { data: assignedData } = useQuery(GET_ASSIGNED_ORDERS);
  const { data: completedData } = useQuery(GET_COMPLETED_ORDERS);
  const { data: deliveryBoysData } = useQuery(GET_DELIVERY_BOYS);

  const { data: deliveryHistoryData, loading: historyLoading, error: historyError } = useQuery(GET_DELIVERY_HISTORY, {
    variables: { deliveryBoyId: selectedDeliveryBoy?.id },
    skip: !selectedDeliveryBoy,
  });

  const { data: deliveryHistorySummaryData, loading: summarLoading, error: summaryError } = useQuery(GET_DELIVERY_HISTORY_SUMMARY, {
    variables: { deliveryBoyId: selectedDeliveryBoy?.id },
    skip: !selectedDeliveryBoy,
  });

  const [assignDelivery] = useMutation(ASSIGN_DELIVERY, {
    refetchQueries: [{ query: GET_PENDING_ORDERS }, { query: GET_ASSIGNED_ORDERS }, { query: GET_DELIVERY_BOYS }],
  });

  const [deleteDeliveryBoy] = useMutation(DELETE_DELIVERY_BOY, {
    refetchQueries: [{ query: GET_PENDING_ORDERS }, { query: GET_ASSIGNED_ORDERS }, { query: GET_DELIVERY_BOYS }],
  });

  const [addDeliveryBoy] = useMutation(ADD_DELIVERY_BOY, {
    refetchQueries: [{ query: GET_DELIVERY_BOYS }],
  });

  const [updateDeliveryStatus] = useMutation(UPDATE_DELIVERY_STATUS, {
    refetchQueries: [
      { query: GET_ASSIGNED_ORDERS },
      { query: GET_COMPLETED_ORDERS },
      { query: GET_DELIVERY_BOYS }
    ],
  });

  const [cancelAssignment] = useMutation(CANCEL_ASSIGNMENT, {
    refetchQueries: [
      { query: GET_PENDING_ORDERS },
      { query: GET_ASSIGNED_ORDERS },
      { query: GET_DELIVERY_BOYS }
    ],
  });

  const handleAssignDelivery = async (orderId, deliveryBoyId) => {
    try {
      await assignDelivery({ variables: { orderId, deliveryBoyId } });
    } catch (error) {
      console.error('Error assigning delivery:', error);
      alert('Failed to assign delivery. Please try again.');
    }
  };

  const handleDeleteDeliveryBoy = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery boy? All assigned orders will be reset to pending.')) {
      try {
        const { data } = await deleteDeliveryBoy({ variables: { id } });
        if (data.deleteDeliveryBoy.success) {
          alert(data.deleteDeliveryBoy.message);
        } else {
          alert('Failed to delete delivery boy: ' + data.deleteDeliveryBoy.message);
        }
      } catch (error) {
        console.error('Error deleting delivery boy:', error);
        alert('An error occurred while deleting the delivery boy');
      }
    }
  };

  const handleAddDeliveryBoy = async (e) => {
    e.preventDefault();
    if (!newDeliveryBoyName || !newDeliveryBoyPhone) {
      alert('Please enter both name and phone for the new delivery boy');
      return;
    }

    try {
      await addDeliveryBoy({
        variables: { name: newDeliveryBoyName, phone: newDeliveryBoyPhone }
      });

      setNewDeliveryBoyName('');
      setNewDeliveryBoyPhone('');
    } catch (error) {
      console.error('Error adding delivery boy:', error);
      alert('Failed to add delivery boy. Please try again.');
    }
  };

  const handleUpdateDeliveryStatus = async (orderId) => {
    try {
      const { data } = await updateDeliveryStatus({ variables: { orderId } });
      if (data.updateDeliveryStatus.success) {
        alert(data.updateDeliveryStatus.message);
      } else {
        alert('Failed to update delivery status: ' + data.updateDeliveryStatus.message);
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('An error occurred while updating delivery status');
    }
  };

  const handleCancelAssignment = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this assignment?')) {
      try {
        const { data } = await cancelAssignment({ variables: { orderId } });
        if (data.cancelAssignment.success) {
          alert(data.cancelAssignment.message);
        } else {
          alert('Failed to cancel assignment: ' + data.cancelAssignment.message);
        }
      } catch (error) {
        console.error('Error cancelling assignment:', error);
        alert('An error occurred while cancelling assignment');
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'yyyy-MM-dd HH:mm:ss');
  };

  const renderOrdersTable = (orders) => (
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Order Number</th>
          <th className="px-4 py-2 border">Total</th>
          <th className="px-4 py-2 border">Payment</th>
          <th className="px-4 py-2 border">Delivery</th>
          <th className="px-4 py-2 border">Created At</th>
          {activeSection !== 'YES' && (
            <th className="px-4 py-2 border">
              {activeSection === 'NOT' ? 'Assign To' : 'Assigned To'}
            </th>
          )}
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="px-4 py-2 border">{order.orderNumber}</td>
            <td className="px-4 py-2 border">${order.total.toFixed(2)}</td>
            <td className="px-4 py-2 border">{order.status}</td>
            <td className="px-4 py-2 border">{order.delivery}</td>
            <td className="px-4 py-2 border">
              {new Date(parseInt(order.createdAt)).toLocaleString()}
            </td>
            {activeSection !== 'YES' && (
              <td className="px-4 py-2 border">
                {activeSection === 'NOT' ? (
                  <select
                    onChange={(e) => handleAssignDelivery(order.id, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Delivery Boy</option>
                    {deliveryBoysData?.deliveryBoys.filter(boy => boy.status === 'AVAILABLE').map((boy) => (
                      <option key={boy.id} value={boy.id}>{boy.name}</option>
                    ))}
                  </select>
                ) : (
                  order.assignedTo && order.assignedTo.name
                )}
              </td>
            )}
            <td className="px-4 py-2 border">
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                👁️‍🗨️
              </button>
              {activeSection === 'ASSIGNED' && (
                <>
                  <button
                    onClick={() => handleUpdateDeliveryStatus(order.id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    ✅️
                  </button>
                  <button
                    onClick={() => handleCancelAssignment(order.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    ❌
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h3 className="text-lg font-bold mb-4">Order Details</h3>
          <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
          <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <p><strong>Delivery:</strong> {selectedOrder.delivery}</p>
          <p><strong>Created At:</strong> {new Date(parseInt(selectedOrder.createdAt)).toLocaleString()}</p>
          {selectedOrder.assignedTo && (
            <>
              <h4 className="font-bold mt-4">Assigned To:</h4>
              <p><strong>Name:</strong> {selectedOrder.assignedTo.name}</p>
              <p><strong>Phone:</strong> {selectedOrder.assignedTo.phone}</p>
              <p><strong>Status:</strong> {selectedOrder.assignedTo.status}</p>
            </>
          )}
          <button
            onClick={() => setSelectedOrder(null)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderDeliveryBoys = () => {
    if (!deliveryBoysData) return null;

    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Delivery Boys</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoysData.deliveryBoys.map((boy) => (
              <tr key={boy.id}>
                <td className="px-4 py-2 border">{boy.name}</td>
                <td className="px-4 py-2 border">{boy.phone}</td>
                <td className="px-4 py-2 border">{boy.status}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDeleteDeliveryBoy(boy.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedDeliveryBoy(boy)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  value={newDeliveryBoyName}
                  onChange={(e) => setNewDeliveryBoyName(e.target.value)}
                  placeholder="New Boy Name"
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="tel"
                  value={newDeliveryBoyPhone}
                  onChange={(e) => setNewDeliveryBoyPhone(e.target.value)}
                  placeholder="New Boy Phone"
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="px-4 py-2 border">-</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={handleAddDeliveryBoy}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderDeliveryHistory = () => {
    if (!selectedDeliveryBoy) return null;
    if (historyLoading || summarLoading) return <p>Loading history...</p>;
    if (historyError || summaryError) return <p>Error loading history.</p>;

    const history = deliveryHistoryData?.getDeliveryHistory || [];
    const summary = deliveryHistorySummaryData?.getDeliveryHistorySummary || { totalDeliveries: 0, totalEarnings: 0 };

    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Delivery History for {selectedDeliveryBoy.name}</h2>
        <div className="mb-4">
          <p>Total Deliveries: {summary.totalDeliveries}</p>
          <p>Total Earnings: ${summary.totalEarnings.toFixed(2)}</p>
        </div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order Number</th>
              <th className="px-4 py-2 border">Delivery Date</th>
              <th className="px-4 py-2 border">Order Total</th>
            </tr>
          </thead>
          <tbody>
            {history.map((delivery) => (
              <tr key={delivery.id}>
                <td className="px-4 py-2 border">{delivery.orderNumber}</td>
                <td className="px-4 py-2 border">{formatDate(delivery.deliveryDate)}</td>
                <td className="px-4 py-2 border">${delivery.orderTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setSelectedDeliveryBoy(null)}
          className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Close History
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Jobs</h1>
      <div className="flex mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeSection === 'NOT' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSection('NOT')}
        >
          Pending
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${activeSection === 'ASSIGNED' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSection('ASSIGNED')}
        >
          Assigned
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === 'YES' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveSection('YES')}
        >
          Completed
        </button>
      </div>
      {activeSection === 'NOT' && pendingData && renderOrdersTable(pendingData.pendingOrders)}
      {activeSection === 'ASSIGNED' && assignedData && renderOrdersTable(assignedData.assignedOrders)}
      {activeSection === 'YES' && completedData && renderOrdersTable(completedData.completedOrders)}
      {renderOrderDetails()}
      {renderDeliveryBoys()}
      {renderDeliveryHistory()}
    </div>
  );
};

export default AssignJobs;

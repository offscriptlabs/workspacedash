import React, { useCallback } from 'react';
import { Package, MapPin, Calendar, Truck, CheckCircle } from 'lucide-react';
import { ShippingOrder } from '../types';
import clsx from 'clsx';
import TrackingStatusComponent from './TrackingStatus';

interface OrderCardProps {
  order: ShippingOrder;
  onEdit: (order: ShippingOrder) => void;
  onStatusChange: (orderId: string, status: ShippingOrder['status']) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onEdit, onStatusChange }) => {
  const handleStatusUpdate = useCallback((status: 'pending' | 'shipped' | 'delivered') => {
    onStatusChange(order.id, status);
  }, [order.id, onStatusChange]);

  const handleEstimatedDeliveryUpdate = useCallback((date: string) => {
    // You could add a callback to update the order's estimated delivery
    console.log('Estimated delivery updated:', date);
  }, []);

  const getStatusIcon = (status: ShippingOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ShippingOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="card p-6 hover:shadow-medium transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {order.customerName}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {order.address}, {order.city}, {order.state} {order.zipCode}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={clsx('status-badge', getStatusColor(order.status))}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Order Date: {new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="text-sm text-gray-500">
              Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tracking Code</span>
            <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
              {order.trackingCode || 'Not assigned'}
            </span>
          </div>
          {order.trackingCode && (
            <TrackingStatusComponent
              trackingNumber={order.trackingCode}
              currentStatus={order.status}
              onStatusUpdate={handleStatusUpdate}
              onEstimatedDeliveryUpdate={handleEstimatedDeliveryUpdate}
            />
          )}
        </div>

        {order.notes && (
          <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
            <span className="font-medium text-gray-700">Notes:</span> {order.notes}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(order)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
        >
          Edit Order
        </button>
        
        <div className="flex items-center space-x-2">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as ShippingOrder['status'])}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 
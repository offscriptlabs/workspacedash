import React from 'react';
import { Package, MapPin, Calendar, Truck, CheckCircle, Edit2, MoreHorizontal } from 'lucide-react';
import { ShippingOrder } from '../types';
import clsx from 'clsx';

interface OrderTableProps {
  orders: ShippingOrder[];
  onEdit: (order: ShippingOrder) => void;
  onStatusChange: (orderId: string, status: ShippingOrder['status']) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onEdit, onStatusChange }) => {
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
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'shipped':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'delivered':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      default:
        return 'bg-warning-100 text-warning-800 border-warning-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Delivery
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {order.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      {order.notes && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      {order.address}
                    </div>
                    <div className="text-gray-500">
                      {order.city}, {order.state} {order.zipCode}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.trackingCode ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {order.trackingCode}
                      </code>
                    ) : (
                      <span className="text-gray-400 text-xs">Not assigned</span>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getStatusColor(order.status)
                    )}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as ShippingOrder['status'])}
                      className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.estimatedDelivery ? (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Not set</span>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(order)}
                      className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      title="Edit order"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">No orders match your current search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OrderTable; 
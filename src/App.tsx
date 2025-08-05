import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import OrderCard from './components/OrderCard';
import OrderTable from './components/OrderTable';
import OrderForm from './components/OrderForm';
import { ShippingOrder } from './types';

// Start with empty orders array
const sampleOrders: ShippingOrder[] = [];

function App() {
  const [orders, setOrders] = useState<ShippingOrder[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ShippingOrder | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  }, [orders]);

  const handleAddOrder = useCallback(() => {
    setEditingOrder(null);
    setIsFormOpen(true);
  }, []);

  const handleEditOrder = useCallback((order: ShippingOrder) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  }, []);

  const handleSaveOrder = useCallback((orderData: Omit<ShippingOrder, 'id' | 'orderDate'>) => {
    if (editingOrder) {
      // Update existing order
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...orderData }
          : order
      ));
    } else {
      // Add new order
      const newOrder: ShippingOrder = {
        ...orderData,
        id: Date.now().toString(),
        orderDate: new Date().toISOString().split('T')[0],
      };
      setOrders(prev => [newOrder, ...prev]);
    }
  }, [editingOrder]);

  const handleStatusChange = useCallback((orderId: string, status: ShippingOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status }
        : order
    ));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddOrder={handleAddOrder}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalOrders={stats.total}
        pendingOrders={stats.pending}
        shippedOrders={stats.shipped}
        deliveredOrders={stats.delivered}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-soft p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first shipping order.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddOrder}
                  className="btn-primary"
                >
                  Add Your First Order
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onEdit={handleEditOrder}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onEdit={handleEditOrder}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      <OrderForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
      />
    </div>
  );
}

export default App; 
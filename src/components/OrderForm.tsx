import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ShippingOrder, OrderFormData } from '../types';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<ShippingOrder, 'id' | 'orderDate'>) => void;
  editingOrder?: ShippingOrder | null;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSave, editingOrder }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    trackingCode: '',
    notes: '',
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        customerName: editingOrder.customerName,
        address: editingOrder.address,
        city: editingOrder.city,
        state: editingOrder.state,
        zipCode: editingOrder.zipCode,
        trackingCode: editingOrder.trackingCode,
        notes: editingOrder.notes || '',
      });
    } else {
      setFormData({
        customerName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        trackingCode: '',
        notes: '',
      });
    }
  }, [editingOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: editingOrder?.status || 'pending',
      estimatedDelivery: editingOrder?.estimatedDelivery,
    });
    onClose();
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingOrder ? 'Edit Order' : 'Add New Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="input-field"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Code
              </label>
              <input
                type="text"
                value={formData.trackingCode}
                onChange={(e) => handleInputChange('trackingCode', e.target.value)}
                className="input-field"
                placeholder="Enter tracking code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="input-field"
              placeholder="Enter street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="input-field"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="input-field"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="input-field"
                placeholder="Enter ZIP code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingOrder ? 'Update Order' : 'Add Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm; 
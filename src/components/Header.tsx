import React from 'react';
import { Package, Plus, Search, Grid, List } from 'lucide-react';

interface HeaderProps {
  onAddOrder: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
}

const Header: React.FC<HeaderProps> = ({
  onAddOrder,
  searchTerm,
  onSearchChange,
  totalOrders,
  pendingOrders,
  shippedOrders,
  deliveredOrders,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 rounded-lg p-2">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Workspace Shipping</h1>
                <p className="text-sm text-gray-500">Manage your shipping orders</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('cards')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
            </div>
            
            <button
              onClick={onAddOrder}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Order</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center space-x-8 py-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">Total:</span>
            <span className="text-sm font-semibold text-gray-900">{totalOrders}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-500">Pending:</span>
            <span className="text-sm font-semibold text-gray-900">{pendingOrders}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-500">Shipped:</span>
            <span className="text-sm font-semibold text-gray-900">{shippedOrders}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-500">Delivered:</span>
            <span className="text-sm font-semibold text-gray-900">{deliveredOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 
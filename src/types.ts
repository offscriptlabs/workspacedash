export interface ShippingOrder {
  id: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  trackingCode: string;
  status: 'pending' | 'shipped' | 'delivered';
  orderDate: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface OrderFormData {
  customerName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  trackingCode: string;
  notes?: string;
} 
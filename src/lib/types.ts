export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isDigital: boolean;
  imageId: string;
  specs: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  total: number;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
}

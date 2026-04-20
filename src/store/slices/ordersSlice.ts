import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sellerId: string;
}

export interface Order {
  id: string | number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  orderDate: string;
  deliveryDate?: string;
}

interface OrdersState {
  orders: Order[];
  userOrders: Order[];
  sellerOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  userOrders: [],
  sellerOrders: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/orders');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3001/orders?customerId=${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'orders/fetchSellerOrders',
  async (sellerId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/orders');
      // Filter orders that contain products from this seller
      const sellerOrders = response.data.filter((order: Order) =>
        order.items.some(item => item.sellerId === sellerId)
      );
      return sellerOrders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (order: Omit<Order, 'id' | 'orderDate'>, { rejectWithValue }) => {
    try {
      const newOrder = {
        ...order,
        orderDate: new Date().toISOString(),
      };
      const response = await axios.post('http://localhost:3001/orders', newOrder);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: string | number; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const updates: Partial<Order> = { status };
      if (status === 'delivered') {
        updates.deliveryDate = new Date().toISOString();
      }
      const response = await axios.patch(`http://localhost:3001/orders/${id}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.sellerOrders = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.userOrders.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        const userIndex = state.userOrders.findIndex(o => o.id === action.payload.id);
        if (userIndex !== -1) {
          state.userOrders[userIndex] = action.payload;
        }
        const sellerIndex = state.sellerOrders.findIndex(o => o.id === action.payload.id);
        if (sellerIndex !== -1) {
          state.sellerOrders[sellerIndex] = action.payload;
        }
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;

export default ordersSlice.reducer;
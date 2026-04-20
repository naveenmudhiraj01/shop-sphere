import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  image?: string;
  sellerId: string;
  sellerName?: string;
  rating?: number;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  sortBy: 'name',
  sortOrder: 'asc',
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Product[]>('http://localhost:3001/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post<Product>('http://localhost:3001/products', product);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }: { id: string | number; updates: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<Product>(`http://localhost:3001/products/${id}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setSortBy: (state, action: PayloadAction<{ sortBy: 'name' | 'price' | 'rating' | 'newest'; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.filteredProducts = applyFilters(state);
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.sortBy = 'name';
      state.sortOrder = 'asc';
      state.filteredProducts = state.products;
    },
    addToWishlist: (state, action: PayloadAction<string>) => {
      // Implementation for wishlist
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      // Implementation for wishlist
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.categories = [...new Set(action.payload.map((p: Product) => p.category))];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
        state.filteredProducts = applyFilters(state);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
          state.filteredProducts = applyFilters(state);
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        state.filteredProducts = applyFilters(state);
      });
  },
});

// Helper function to apply filters and sorting
const applyFilters = (state: ProductsState): Product[] => {
  let filtered = [...state.products];

  // Search filter
  if (state.searchQuery) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }

  // Category filter
  if (state.selectedCategory) {
    filtered = filtered.filter(product => product.category === state.selectedCategory);
  }

  // Sorting
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;

    switch (state.sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'newest':
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
      default:
        return 0;
    }

    if (state.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  clearFilters,
  addToWishlist,
  removeFromWishlist,
} = productsSlice.actions;

export default productsSlice.reducer;
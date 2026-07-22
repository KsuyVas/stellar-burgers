import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  isConnecting: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  isConnecting: false
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const wsConnectProfileOrders = (url: string) => ({
  type: 'profileOrders/wsConnect' as const,
  payload: url
});

export const wsDisconnectProfileOrders = () => ({
  type: 'profileOrders/wsDisconnect' as const
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.isConnecting = true;
    },
    wsOpen: (state) => {
      state.isConnecting = false;
      state.error = null;
    },
    wsClose: (state) => {
      state.isConnecting = false;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    wsMessage: (state, action: PayloadAction<{ orders: TOrder[] }>) => {
      state.orders = action.payload.orders;
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export const {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  clearOrders
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;

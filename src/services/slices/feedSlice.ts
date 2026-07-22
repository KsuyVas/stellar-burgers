// services/slices/feedSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  isConnecting: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  isConnecting: false
};

// REST-запрос для первоначальной загрузки
export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

// WebSocket действия
export const wsConnect = (url: string) => ({
  type: 'feed/wsConnect' as const,
  payload: url
});

export const wsDisconnect = () => ({
  type: 'feed/wsDisconnect' as const
});

const feedSlice = createSlice({
  name: 'feed',
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
    wsMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      });
  }
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } =
  feedSlice.actions;
export default feedSlice.reducer;

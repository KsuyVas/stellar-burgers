import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer } from './reducers/rootReducer';
import { socketMiddleware } from './middleware/socketMiddleware';
import {
  wsConnect,
  wsDisconnect,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage
} from './slices/feedSlice';
import {
  wsConnectProfileOrders,
  wsDisconnectProfileOrders
} from './slices/profileOrdersSlice';

const feedWsActions = {
  wsConnect: wsConnect('').type,
  wsDisconnect: wsDisconnect().type,
  wsConnecting: wsConnecting.type,
  wsOpen: wsOpen.type,
  wsClose: wsClose.type,
  wsError: wsError.type,
  wsMessage: wsMessage.type
};

const profileOrdersWsActions = {
  wsConnect: wsConnectProfileOrders('').type,
  wsDisconnect: wsDisconnectProfileOrders().type,
  wsConnecting: wsConnecting.type,
  wsOpen: wsOpen.type,
  wsClose: wsClose.type,
  wsError: wsError.type,
  wsMessage: wsMessage.type
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      socketMiddleware(feedWsActions),
      socketMiddleware(profileOrdersWsActions, true)
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

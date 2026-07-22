import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import userReducer from '../slices/userSlice';
import constructorReducer from '../slices/constructorSlice';
import feedReducer from '../slices/feedSlice';
import orderReducer from '../slices/orderSlice';
import profileOrdersReducer from '../slices/profileOrdersSlice';
import orderInfoReducer from '../slices/orderInfoSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer,
  orderInfo: orderInfoReducer
});

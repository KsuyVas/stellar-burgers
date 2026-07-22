import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  wsConnect,
  wsDisconnect
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, isConnecting } = useSelector(
    (state) => state.feed
  );

  useEffect(() => {
    dispatch(wsConnect('wss://norma.nomoreparties.space/orders/all'));
    dispatch(fetchFeeds());

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading || isConnecting) {
    return <Preloader />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className='text text_type_main-medium pt-10'>
        Нет заказов. Создайте первый заказ!
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

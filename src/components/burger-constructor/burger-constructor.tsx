import { FC, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../../services/slices/constructorSlice';
import { createOrder } from '../../services/slices/orderSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient, TOrder, TIngredient } from '@utils-types';
import { Preloader } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { user } = useSelector((state) => state.user);
  const { isLoading: isOrderLoading } = useSelector((state) => state.order);

  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients.map((item: TIngredient, index: number) => ({
      ...item,
      id: item._id + '_' + index
    })) as TConstructorIngredient[]
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onRemove = (id: string) => {
    const originalId = id.split('_')[0];
    dispatch(removeIngredient(originalId));
  };

  const onMove = (from: number, to: number) => {
    dispatch(moveIngredient({ from, to }));
  };

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun || ingredients.length === 0) {
      alert('Добавьте булку и начинку!');
      return;
    }

    const orderData = [
      bun._id,
      ...ingredients.map((item: TIngredient) => item._id)
    ];

    dispatch(createOrder(orderData))
      .unwrap()
      .then((order: TOrder) => {
        setOrderModalData(order);
        dispatch(clearConstructor());
        dispatch(fetchFeeds());
      })
      .catch((err: Error) => {
        console.error('Ошибка оформления заказа:', err);
        alert('Ошибка оформления заказа');
      });
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  return (
    <>
      <BurgerConstructorUI
        constructorItems={constructorItems}
        orderRequest={isOrderLoading}
        price={price}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {isOrderLoading && <Preloader />}
    </>
  );
};

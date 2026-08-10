import { describe, expect, test } from '@jest/globals';
import orderReducer, {
  createOrder,
  clearOrder,
  initialState
} from '../orderSlice';
import { TOrder } from '@utils-types';

describe('[orderSlice] тесты редьюсера заказа', () => {
  // 1. Тест на неизвестный экшен
  test('должен вернуть начальное состояние для неизвестного экшена', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('тесты синхронного экшена clearOrder', () => {
    // 2. Тест на clearOrder
    test('должен очистить заказ', () => {
      const stateWithOrder = {
        order: {
          _id: '1',
          status: 'done',
          name: 'Test Order',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          number: 123,
          ingredients: ['ing1', 'ing2']
        } as TOrder,
        isLoading: false,
        error: null
      };
      const state = orderReducer(stateWithOrder, clearOrder());
      expect(state).toEqual(initialState);
    });
  });

  describe('тесты асинхронного экшена createOrder', () => {
    // 3. Тест на pending
    test('должен установить isLoading в true при createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    // 4. Тест на fulfilled
    test('должен сохранить заказ при createOrder.fulfilled', () => {
      const mockOrder: TOrder = {
        _id: 'test_order_123',
        status: 'done',
        name: 'Test Burger',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        number: 12345,
        ingredients: ['ing1', 'ing2']
      };

      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };

      const state = orderReducer({ ...initialState, isLoading: true }, action);
      expect(state).toEqual({
        order: mockOrder,
        isLoading: false,
        error: null
      });
    });

    // 5. Тест на rejected
    test('должен установить ошибку при createOrder.rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };

      const state = orderReducer({ ...initialState, isLoading: true }, action);

      expect(state).toEqual({
        order: null,
        isLoading: false,
        error: errorMessage
      });
    });
  });
});

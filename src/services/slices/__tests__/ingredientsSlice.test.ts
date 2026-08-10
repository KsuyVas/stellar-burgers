import { describe, expect, test } from '@jest/globals';
import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('[ingredientsSlice] тесты редьюсера ингредиентов', () => {
  // 1. Тест на неизвестный экшен (как в теории)
  test('должен вернуть начальное состояние для неизвестного экшена', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('тесты асинхронного экшена fetchIngredients', () => {
    // 2. Тест на pending (как в теории про асинхронные экшены)
    test('должен установить isLoading в true при fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    // 3. Тест на fulfilled (как в теории про асинхронные экшены)
    test('должен загрузить данные при fetchIngredients.fulfilled', () => {
      const mockData: TIngredient[] = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'bun.png',
          image_large: 'bun_large.png',
          image_mobile: 'bun_mobile.png'
        }
      ];

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockData
      };

      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state).toEqual({
        data: mockData,
        isLoading: false,
        error: null
      });
    });

    // 4. Тест на rejected (как в теории про асинхронные экшены)
    test('должен установить ошибку при fetchIngredients.rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state).toEqual({
        data: [],
        isLoading: false,
        error: errorMessage
      });
    });

    // 5. Тест на rejected без сообщения (как в теории про обработку ошибок)
    test('должен установить сообщение по умолчанию при rejected без error.message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };

      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state).toEqual({
        data: [],
        isLoading: false,
        error: 'Ошибка загрузки ингредиентов'
      });
    });
  });
});

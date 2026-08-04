import { describe, expect, test } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

describe('[burgerConstructorSlice] тесты редьюсера конструктора', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'sauce.png',
    image_large: 'sauce_large.png',
    image_mobile: 'sauce_mobile.png'
  };

  // 1. Тест на неизвестный экшен
  test('должен вернуть начальное состояние для неизвестного экшена', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('тесты синхронных экшенов', () => {
    // 2. Тест на добавление булки
    test('должен добавить булку', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);
      expect(state).toEqual({
        bun: mockBun,
        ingredients: []
      });
    });

    // 3. Тест на добавление ингредиента (как в теории)
    test('должен добавить ингредиент в список', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);
      expect(state).toEqual({
        bun: null,
        ingredients: [mockIngredient]
      });
    });

    // 4. Тест на удаление ингредиента (как в теории)
    test('должен удалить ингредиент по id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [mockIngredient]
      };
      const action = removeIngredient(mockIngredient._id);
      const state = constructorReducer(stateWithIngredients, action);
      expect(state).toEqual(initialState);
    });

    // 5. Тест на удаление несуществующего ингредиента
    test('не должен изменять состояние при удалении несуществующего ингредиента', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [mockIngredient]
      };
      const action = removeIngredient('non-existent-id');
      const state = constructorReducer(stateWithIngredients, action);
      expect(state).toEqual(stateWithIngredients);
    });

    // 6. Тест на очистку конструктора
    test('должен очистить конструктор', () => {
      const stateWithItems = {
        bun: mockBun,
        ingredients: [mockIngredient]
      };
      const action = clearConstructor();
      const state = constructorReducer(stateWithItems, action);
      expect(state).toEqual(initialState);
    });

    // 7. Тест на перемещение ингредиента
    test('должен переместить ингредиент', () => {
      const ingredient1 = { ...mockIngredient, _id: '1' };
      const ingredient2 = { ...mockIngredient, _id: '2' };
      const stateWithIngredients = {
        bun: null,
        ingredients: [ingredient1, ingredient2]
      };
      const action = moveIngredient({ from: 0, to: 1 });
      const state = constructorReducer(stateWithIngredients, action);
      expect(state).toEqual({
        bun: null,
        ingredients: [ingredient2, ingredient1]
      });
    });
  });
});

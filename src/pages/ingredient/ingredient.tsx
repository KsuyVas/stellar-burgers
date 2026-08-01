import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../../components/ui/preloader';
import { TIngredient } from '@utils-types';
import styles from './ingredient.module.css';

export const IngredientPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ingredients, isLoading } = useSelector(
    (state) => state.ingredients
  );

  const ingredientData =
    ingredients.find((item: TIngredient) => item._id === id) || null;

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  const { name, image_large, calories, proteins, fat, carbohydrates } =
    ingredientData;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={`text text_type_main-large ${styles.title}`}>
          Детали ингредиента
        </h1>
        <img
          className={styles.image}
          alt='изображение ингредиента.'
          src={image_large}
        />
        <h3 className='text text_type_main-medium mt-2 mb-4'>{name}</h3>
        <ul className={styles.nutritionalValues}>
          <li className={styles.nutritionalValue}>
            <p className='text mb-2'>Калории, ккал</p>
            <p className='text text_type_digits-default'>{calories}</p>
          </li>
          <li className={styles.nutritionalValue}>
            <p className='text mb-2'>Белки, г</p>
            <p className='text text_type_digits-default'>{proteins}</p>
          </li>
          <li className={styles.nutritionalValue}>
            <p className='text mb-2'>Жиры, г</p>
            <p className='text text_type_digits-default'>{fat}</p>
          </li>
          <li className={styles.nutritionalValue}>
            <p className='text mb-2'>Углеводы, г</p>
            <p className='text text_type_digits-default'>{carbohydrates}</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

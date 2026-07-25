import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  IngredientDetails,
  OrderInfo
} from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice';
import { useEffect } from 'react';
import styles from './app.module.css';
import { getCookie } from '../../utils/cookie';

const App = () => {
  /** TODO: взять переменные из стора */
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  const matchFeed = useMatch('/feed/:number');
  const matchProfileOrders = useMatch('/profile/orders/:number');

  const {
    data: ingredients,
    isLoading,
    error
  } = useSelector((state) => state.ingredients);

  const { isAuthChecked } = useSelector((state) => state.user);

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser());
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  if (!isAuthChecked || isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          Ошибка: {error}
        </div>
      </div>
    );
  }

  if (!ingredients.length) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${matchFeed?.params.number || 'Заказ'}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                  <IngredientDetails />
                </div>
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${matchProfileOrders?.params.number || 'Заказ'}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

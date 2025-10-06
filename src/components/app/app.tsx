import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ResetPassword,
  ForgotPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useParams } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getIngredientsThunk } from '@slices/ingredientsSlice';
import { getUserThunk } from '@slices/userSlice';
import { AppHeader, Modal } from '@components';
import { useDispatch, useSelector } from '@store';

import { useEffect } from 'react';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getUserThunk());
  }, [dispatch]);

  const handleClose = () => {
    navigate(-1);
  };

  const OrderModalWrapper = () => {
    const { number } = useParams();
    const navigate = useNavigate();

    const handleClose = () => navigate(-1);

    return (
      <Modal
        title={`#${number}`}
        onClose={handleClose}
        titleClassName={styles.orderTitle}
      >
        <OrderInfo />
      </Modal>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
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
        <Route path='/feed/:number' element={<OrderModalWrapper />} />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={handleClose} >
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderModalWrapper />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

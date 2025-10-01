import { ReactElement } from 'react';
import { useSelector } from '@store';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean; // если true — доступно только неавторизованным
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const { isAuth, isLoading, authChecked } = useSelector((state) => state.user);

  if (!authChecked) return <Preloader />;

  if (onlyUnAuth && isAuth) return <Navigate to='/' replace />;
  if (!onlyUnAuth && !isAuth) return <Navigate to='/login' replace />;

  return children;
};

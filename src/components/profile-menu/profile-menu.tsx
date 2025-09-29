import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUserThunk } from '@slices/userSlice';
import { useDispatch, useSelector } from '@store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUserThunk());
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login', { replace: true });
    }
  }, [isAuth, navigate]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

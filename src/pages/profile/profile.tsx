import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { updateUserThunk, logoutUserThunk } from '@slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuth, authChecked } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUserThunk(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/login', { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};

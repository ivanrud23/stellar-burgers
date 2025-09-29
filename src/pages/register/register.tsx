import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { registerUserThunk } from '@slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ email, name: userName, password }))
      .unwrap()
      .then(() => {
        navigate('/profile');
      })
      .catch(() => {});
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

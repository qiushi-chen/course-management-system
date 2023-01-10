import { AUTH_TOKEN } from '@/constants';
import { LoginResponse as UserInfo } from '../model/login';

const setUser = (user: UserInfo) => {
  localStorage.setItem(AUTH_TOKEN, JSON.stringify(user));
};

const deleteUser = () => {
  localStorage.removeItem(AUTH_TOKEN);
};

const getUser = (): UserInfo | null => {
  const item = localStorage.getItem(AUTH_TOKEN);
  if (item) {
    const user = JSON.parse(item) as UserInfo;
    return user;
  }
  return null;
};

const token = (): undefined | string => {
  const user = getUser();
  return user?.token;
};

const role = (): undefined | string => {
  const user = getUser();
  console.log('storage', user, user?.role);
  return user?.role;
};

const userId = (): undefined | number => {
  const user = getUser();
  return user?.userId;
};

const storage = {
  deleteUser,
  getUser,
  setUser,
  role,
  token,
  userId,
};

export default storage;

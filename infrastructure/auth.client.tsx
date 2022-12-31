import { AES } from 'crypto-js';

import settings from '@/settings';
import { User, LoginResponse } from '../domain/user.d';

const login = async (user: User) => {
  const { password } = user;
  const encrypted = AES.encrypt(password, 'cms').toString();

  user = { ...user, password: encrypted };

  const url = `${settings.base_url}/login`;
  const opts = {
    method: 'post',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const res = await fetch(url, opts);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    const data = await res.json();
    return data as LoginResponse;
  } catch (err) {
    console.error(err);
    return Promise.reject('user login error');
  }
};

const signup = (user: User) => {};

const auth_client = {
  login,
  signup,
};

export default auth_client;

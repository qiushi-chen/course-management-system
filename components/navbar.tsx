import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
import { AUTH_TOKEN } from '@/constants';
import { useRouter } from 'next/router';
const { Header } = Layout;

const Navbar: React.FC = () => {
  const menu = ['login', 'signup'];
  const [auth, setAuth] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    setAuth(!!token);
  }, []);

  return (
    <>
      {router.route.startsWith('/dashboard') ? (
        <></>
      ) : (
        <Header
          style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
          <div className='logo' />

          <Menu
            theme='dark'
            mode='horizontal'
            defaultSelectedKeys={['signup']}
            items={menu.map((value, _) => {
              return {
                key: value,
                label: <Link href={`/${value}`}>{value}</Link>,
              };
            })}
          />
        </Header>
      )}
    </>
  );
};

export default Navbar;

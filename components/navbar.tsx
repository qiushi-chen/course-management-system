import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout, Menu, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AUTH_TOKEN } from '@/constants';
const { Header } = Layout;

const Navbar: React.FC = () => {
  const menu = ['login', 'signup'];
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    setAuth(!!token);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      {auth ? (
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
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

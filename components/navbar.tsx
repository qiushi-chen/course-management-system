import React from 'react';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
const { Header } = Layout;

const Navbar: React.FC = () => {
  const menu = ['login', 'signup'];

  return (
    <>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
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
    </>
  );
};

export default Navbar;

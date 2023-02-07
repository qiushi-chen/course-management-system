import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { MenuProps, Space } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { routes, SideNav } from '@/constants/routes';
import { GetActiveKey, generateKey } from '@/lib/util/side.nav';
import { useUserRole } from '@/hooks/login.state';
import { Role } from '@/constants/role';
import AppBreadcrumb from './breadcrumb';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Link href='/dashboard/manager/' rel='noopener noreferrer'>
      Overview
    </Link>,
    '1',
    <PieChartOutlined />
  ),
  // getItem('Student', 'sub1', <UserOutlined />, [
  getItem('Student', '', <UserOutlined />, [
    getItem(
      <Link href='/dashboard/manager/students' rel='noopener noreferrer'>
        Student List
      </Link>,
      '2',
      <PieChartOutlined />
    ),
  ]),
  getItem('Teacher', 'sub2', <UserOutlined />, [
    getItem('Teacher List', '3', <PieChartOutlined />),
  ]),
  getItem('Course', 'sub3', <TeamOutlined />, [
    getItem('All Courses', '4', <PieChartOutlined />),
    getItem('Add Courses', '5', <PieChartOutlined />),
    getItem('Edit Courses', '6', <PieChartOutlined />),
  ]),
  getItem('Message', '9', <FileOutlined />),
];

type Props = {
  children: ReactNode;
};

const getMenuConfig = (
  data: SideNav[]
): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
  const key = GetActiveKey(data);
  const defaultSelectedKeys = [key.split('/').pop()];
  const defaultOpenKeys = key.split('/').slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

const RenderMenuItems = (data: SideNav[], parent = ''): JSX.Element[] => {
  const userRole = useUserRole();

  console.log('role', userRole, data);

  return data.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {RenderMenuItems(item.subNav, item.path.join('/'))}
        </Menu.SubMenu>
      );
    } else {
      return item.hide ? null : (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length ||
          item.label.toLocaleLowerCase() === 'overview' ? (
            <Link
              href={['/dashboard', userRole, parent, ...item.path]
                .filter((item) => !!item)
                .join('/')}
              replace>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
};

const DashboardLayout: React.FC = ({ children }: React.PropsWithChildren) => {
  const userRole = useUserRole();
  console.log('user role', userRole);
  const sideNav = routes.get(userRole as Role);
  const menuItems = RenderMenuItems(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);

  // side nav
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: '2rem',
            lineHeight: '2rem',
            margin: '1rem',
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: '5px',
            textShadow: '5px 1px 5px',
            textAlign: 'center',
            cursor: 'pointer',
          }}>
          <Link href='/'>
            <span>CMS</span>
          </Link>
        </div>
        <Menu
          theme='dark'
          mode='inline'
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          // items={items}
        >
          {menuItems}
        </Menu>
      </Sider>

      <Layout
        id='content-layout'
        className='site-layout'
        style={{ height: '100vh', overflowY: 'scroll' }}>
        <Header
          style={{
            top: 0,
            position: 'sticky',
            zIndex: 1,
            paddingLeft: '3rem',
            color: 'white',
            background: 'dark',
          }}>
          <Space
            split
            style={{ display: 'flex', justifyContent: 'space-between' }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                style: { fontSize: '1.2rem' },
                onClick: () => {
                  setCollapsed(!collapsed);
                },
              }
            )}

            <Space size={'large'}>
              <BellOutlined style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
              <UserOutlined style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
            </Space>
          </Space>
        </Header>

        <AppBreadcrumb />

        {/* <Breadcrumb style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}

        <Content
          style={{
            margin: '1rem',
            padding: 24,
            background: colorBgContainer,
            overflow: 'initial',
          }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

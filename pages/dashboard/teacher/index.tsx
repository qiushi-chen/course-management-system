import React from 'react';
import Link from 'next/link';
import {
  UserOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import DashboardLayout from '@/components/dashboard.layout';

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
  getItem('Student', 'sub1', <UserOutlined />, [
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

const Teacher: React.FC = () => {
  return (
    <DashboardLayout>
      <h1>Teacher Dashboard</h1>
    </DashboardLayout>
  );
};

export default Teacher;

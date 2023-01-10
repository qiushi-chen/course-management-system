import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Space, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { formatDistanceToNow } from 'date-fns';
import qs from 'qs';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

import settings from '@/settings';
import { AUTH_TOKEN } from '@/constants';
import { Student, FetchStudentsResponse, Course } from '@/domain/user.d';

const { Header, Content, Footer, Sider } = Layout;

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
  // getItem('Option 2', '2', <DesktopOutlined />),
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

type StudentData = {
  index: number;
  student: Student;
};

const columns: ColumnsType<StudentData> = [
  {
    title: 'No.',
    dataIndex: 'index',
  },
  {
    title: 'Name',
    dataIndex: 'student',
    render: (student) => <Link href='javascript:;'>{student?.name}</Link>,
    sorter: true,
  },
  {
    title: 'Area',
    dataIndex: 'student',
    render: (student) => `${student?.country}`,
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'student',
    render: (student) => `${student?.email}`,
  },
  {
    title: 'Selected Curriculum',
    dataIndex: 'student',
    render: (student) =>
      `${student.courses.map((course: Course) => `${course?.name} `)}`,
    sorter: true,
  },
  {
    title: 'Student Type',
    dataIndex: 'student',
    render: (student) => `${student?.type?.name}`,
  },
  {
    title: 'Date Of Join',
    dataIndex: 'student',
    render: (student: Student) =>
      formatDistanceToNow(new Date(student?.createdAt), { addSuffix: true }), //`${student?.createdAt}`,
  },
  {
    title: 'Action',
    dataIndex: 'student',
    render: () => (
      <Space size='middle'>
        <Link href='javascript:;'>Edit</Link>
        <Link href='javascript:;'>Delete</Link>
      </Space>
    ),
  },
];

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const getUrlParams = (params: TableParams) => {
  console.log('params', params);
  return {
    page: params.pagination?.current,
    limit: params.pagination?.pageSize,
    // ...params,
  };
};

const Manager: React.FC = () => {
  // side nav
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const urlParams = getUrlParams(tableParams);
    const { page = 0, limit = 0 } = urlParams;
    const offset = (page - 1) * limit;

    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      const url = `${settings.base_url}/students?${qs.stringify(urlParams)}`;
      const opts = {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const res = await fetch(url, opts);
      const results = await res.json();

      if (results) {
        const { data, code, msg } = results as FetchStudentsResponse;
        setStudents(
          data.students.map((student, index) => ({
            student: student,
            index: offset + index + 1,
          }))
        );
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.total,
          },
        });
      }
    }
  };



  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<StudentData>
  ) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setStudents([]);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu
          theme='dark'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={items}
        />
      </Sider>
      <Layout className='site-layout'>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}>
          Manager Dashboard
        </Content>
      </Layout>
    </Layout>
  );
};

export default Manager;

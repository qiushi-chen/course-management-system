import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button, message, Input, Popconfirm, Row, Space, Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { formatDistanceToNow } from 'date-fns';
import { debounce } from 'lodash';
import qs from 'qs';
import {
  PlusOutlined,
  UserOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, theme } from 'antd';

import settings from '@/settings';
import { ACT_CREATE, ACT_UPDATE, AUTH_TOKEN } from '@/constants';
import { Student, FetchStudentsResponse, Course } from '@/domain/user.d';
import PopUpForm from '@/components/form';
import { addStudent, deleteStudent, updateStudent } from '@/crud/student';
import storage from '@/lib/service/storage';
import DashboardLayout from '@/components/dashboard.layout';

const { Search } = Input;

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

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const getUrlParams = (params: TableParams) => {
  console.log('getUrlParams', params);
  return {
    page: params.pagination?.current,
    limit: params.pagination?.pageSize,
    // ...params,
  };
};

const Manager: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [failure, setFailure] = useState(false);

  // set update to true to fetch latest result when add or edit or delete
  const [update, setUpdate] = useState(false);

  // const success = () => {
  //   messageApi.open({
  //     type: 'success',
  //     content: 'Student added successfully',
  //   });
  // };

  // const error = () => {
  //   messageApi.open({
  //     type: 'error',
  //     content: 'Student add failed',
  //   });
  // };

  // side nav
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const initValues = {
    name: '',
    email: '',
    country: '',
    type: -1,
    action: '',
    id: -1,
  };

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initValues);

  const onCreateOrUpdate = (data: any) => {
    const token = localStorage.getItem(AUTH_TOKEN) as string;
    const { action } = values;
    if (action === ACT_CREATE) {
      addStudent(data, token);
    } else if (action === ACT_UPDATE) {
      updateStudent({ ...data, id: values.id }, token);
      setUpdate(true);
    }
    setOpen(false);
  };

  // useEffect(() => {
  //   failure ? error() : success();
  // }, [error, failure, success]);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20,
    },
  });

  // start debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('on search query', e.target.value);
    fetchData(e.target.value);
  };

  // end debounce

  const fetchData = useCallback(
    async (query: string = '') => {
      setLoading(true);
      console.log(tableParams);
      const urlParams = getUrlParams(tableParams);

      const token = storage.token();

      // const res = await apiService.getStudents();
      // console.log('get student', res);

      // debugger;

      // const token = localStorage.getItem(AUTH_TOKEN) as string;
      let url = `${settings.base_url}/students?${qs.stringify(urlParams)}`;
      if (query) {
        url = `${settings.base_url}/students?query=${query}&${qs.stringify(
          urlParams
        )}`;
      }
      console.log('fetch data', query, url);
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
        const { data } = results as FetchStudentsResponse;
        // debugger;
        setStudents(data.students);
        setLoading(false);

        console.log('1', { ...tableParams });
        console.log('2', { ...tableParams.pagination });
        console.log('3', data.total);

        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.total,
          },
        });
      }
    },
    [tableParams]
  );

  const debouncedChangeHandler = debounce(handleChange, 500);

  useEffect(() => {
    console.log('use effect');
    // console.log('table params', JSON.stringify(tableParams));
    fetchData();
  }, [tableParams.pagination.current]);

  const handleDelete = (id: number) => {
    const token = localStorage.getItem(AUTH_TOKEN) as string;
    deleteStudent(id, token);

    // set update to true, fetch latest data
    setUpdate(true);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<Student>
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

  const urlParams = getUrlParams(tableParams);
  const { page = 0, limit = 0 } = urlParams;
  const offset = (page - 1) * limit;

  const columns: ColumnsType<Student> = [
    {
      title: 'No.',
      render: (_: any, s: Student, index: number) => offset + 1 + index,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, stu: Student) => (
        <Link href={`/dashboard/manager/students/${stu.id}`}>{stu.name}</Link>
      ),
      sorter: true,
    },
    {
      title: 'Area',
      dataIndex: 'country',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'courses',
      render: (courses) =>
        `${courses.map((course: Course) => `${course && course.name} `)}`,
      sorter: true,
    },
    {
      title: 'Student Type',
      dataIndex: 'type',
      render: (type) => `${type?.name ?? ''}`,
    },
    {
      title: 'Date Of Join',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        formatDistanceToNow(new Date(createdAt), { addSuffix: true }),
    },
    {
      title: 'Action',
      render: (value: any, student: Student, index: number) => {
        const { id, name, email, country, type } = student;
        return (
          <Space size='middle'>
            {/* <Link href='#'>Edit</Link> */}
            <Button
              type='link'
              onClick={() => {
                setOpen(true);
                setValues({
                  id,
                  name,
                  email,
                  country,
                  type: type?.id,
                  action: ACT_UPDATE,
                });
              }}>
              Edit
            </Button>
            <Popconfirm
              placement='topRight'
              title='Delete student'
              description='Are you sure to delete this student?'
              okText='Yes'
              cancelText='No'
              onCancel={() => console.log('on delete cancel')}
              onConfirm={() => handleDelete(student.id)}>
              <Link href='#'>Delete</Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <Space direction='vertical'>
        <Row justify='space-between'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
              setValues({ ...values, action: ACT_CREATE });
            }}>
            Add
          </Button>

          <PopUpForm
            open={open}
            values={values}
            onCreate={onCreateOrUpdate}
            onCancel={() => {
              setOpen(false);
              setValues(initValues);
            }}
          />

          <Search
            placeholder='Search By Name'
            allowClear
            // onSearch={(query) => debouncedChangeHandler(query)}
            onChange={debouncedChangeHandler}
            // onChange={(e) => console.log(e.target.value)}
            style={{ width: 400 }}
          />
        </Row>

        <Table
          // style={{display: 'flex' justify-content: 'center'}}
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={students}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Space>
    </DashboardLayout>
  );
};

export default Manager;

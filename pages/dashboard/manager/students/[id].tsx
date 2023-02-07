import { Avatar, Card, Col, Row, Table, Tabs, Tag } from 'antd';
import type { TabsProps } from 'antd';

import DashboardLayout from '@/components/dashboard.layout';
import { Course } from '@/domain/user.d';
import { StudentResponse } from '@/lib/model/student';
import apiService from '@/lib/service/api.service';
import storage from '@/lib/service/storage';
import { ColumnType } from 'antd/es/table';
import Link from 'next/link';
import { BaseType } from '@/lib/model';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { programLanguageColors } from '@/lib/constant';

// const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };
const H3: React.CSSProperties = {
  color: '#7356f1',
  margin: '20px 0px',
  fontSize: '24px',
};

// export const H3 = styled.h3`
//   color: #7356f1;
//   margin: 20px 0px;
//   font-size: 24px;
// `;

export async function getServerSideProps(context: any) {
  // todo get student profile here;
  const { id } = context.params;

  return {
    props: { id },
  };
}

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Tab 1`,
    children: `Content of Tab Pane 1`,
  },
  {
    key: '2',
    label: `Tab 2`,
    children: `Content of Tab Pane 2`,
  },
];

const StudentDetail = (props: { id: number }) => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  );
  const [about, setAbout] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [data, setData] = useState<StudentResponse>(null);
  const columns: ColumnType<Course>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value, record) => (
        <Link href={`/dashboard/${storage.role}/courses/${record.id}`}>
          {value}
        </Link>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type: BaseType[]) => type.map((item) => item.name).join(','),
    },
    {
      title: 'Join Time',
      dataIndex: 'ctime',
    },
  ];

  useEffect(() => {
    (async () => {
      const id = +router.query.id || props.id;
      // const url = `/api/students`;
      const url = `/api/students?id=${id}`;

      // let response = await fetch(url, { method: 'GET' });
      let response = await fetch(url);
      const data = (await response.json()).data;
      console.log('get = 1', data);

      // const { data } = await apiService.getStudentById(id);
      // console.log(data);

      // debugger;
      const info = [
        { label: 'Name', value: data.name },
        { label: 'Age', value: data.age },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
      ];
      const about = [
        { label: 'Eduction', value: data.education },
        { label: 'Area', value: data.country },
        { label: 'Gender', value: data.gender === 1 ? 'Male' : 'Female' },
        {
          label: 'Member Period',
          value: data.memberStartAt + ' - ' + data.memberEndAt,
        },
        { label: 'Type', value: data.type.name },
        { label: 'Create Time', value: data.ctime },
        { label: 'Update Time', value: data.updateAt },
      ];

      setInfo(info);
      console.log('data.courses : ', data.courses, typeof data.courses);
      setCourses(data.courses);
      setAbout(about);
      setData(data);
    })();
  }, []);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <DashboardLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={data?.avatar}
                style={{
                  width: 100,
                  height: 100,
                  display: 'block',
                  margin: 'auto',
                }}
              />
            }>
            <Row gutter={[6, 16]}>
              {info.map((item) => (
                <Col span={12} key={item.label} style={{ textAlign: 'center' }}>
                  <b>{item.label}</b>
                  <p>{item.value}</p>
                </Col>
              ))}
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <b>Address</b>
                <p>{data?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            {/* <Tabs defaultActiveKey='1' items={items} onChange={onChange} /> */}
            <Tabs defaultActiveKey='1' animated={true}>
              <Tabs.TabPane tab='About' key='1'>
                <h3 style={H3}>Information</h3>

                <Row gutter={[6, 16]}>
                  {about.map((item) => (
                    <Col span={24} key={item.label}>
                      <b
                        style={{
                          marginRight: 16,
                          minWidth: 150,
                          display: 'inline-block',
                        }}>
                        {item.label}:
                      </b>
                      <span>{item.value}</span>
                    </Col>
                  ))}
                </Row>

                <h3 style={H3}>Interesting</h3>

                <Row gutter={[6, 16]}>
                  <Col>
                    {data?.interest.map((item, index) => (
                      <Tag
                        color={programLanguageColors[index]}
                        key={item}
                        style={{ padding: '5px 10px' }}>
                        {item}
                      </Tag>
                    ))}
                  </Col>
                </Row>

                <h3 style={H3}>Description</h3>

                <Row gutter={[6, 16]}>
                  <Col style={{ lineHeight: 2 }}>{data?.description}</Col>
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab='Courses' key='2'>
                <Table
                  dataSource={courses}
                  columns={columns}
                  rowKey='id'></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default StudentDetail;

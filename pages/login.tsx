import React from 'react';
import Link from 'next/link';
import { Col, Row, Button, Checkbox, Form, Input, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [form] = Form.useForm();

  return (
    <>
      <Row>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 18, offset: 3 }}
          md={{ span: 14, offset: 5 }}
          lg={{ span: 8, offset: 8 }}>
          <h1 style={{ textAlign: 'center' }}>Login to your account</h1>

          <Form
            form={form}
            layout='vertical'
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'>
            <Form.Item
              name='role'
              rules={[{ required: true, message: 'Please select your role!' }]}>
              <Radio.Group>
                <Radio.Button value='student'>Student</Radio.Button>
                <Radio.Button value='teacher'>Teacher</Radio.Button>
                <Radio.Button value='manager'>Manager</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name='email'
              hasFeedback
              tooltip='Email is a required field'
              rules={[
                {
                  required: true,
                  message: 'Please enter your email',
                },
                {
                  type: 'email',
                  message:
                    'The input is not valid E-mail! e.g. yourname@example.com',
                },
              ]}>
              <Input
                size='large'
                placeholder='Please enter email'
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name='password'
              hasFeedback
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}>
              <Input.Password
                size='large'
                placeholder='Please enter password'
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item name='remember' valuePropName='unchecked'>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
                block>
                Sign In
              </Button>
            </Form.Item>

            <Form.Item>
              No Account?
              <Link href='/signup'> Register now!</Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default Login;

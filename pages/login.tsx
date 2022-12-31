import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Col, Row, Button, Checkbox, Form, Input, message, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const success = (role: string) => {
    messageApi.open({
      type: 'success',
      content: `User login as ${role} successfully`,
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'User login error',
    });
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);

    try {
      const opts = {
        method: 'post',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      };

      const res = await fetch(`/api/login`, opts);
      const data = await res.json();

      console.log('user info', data);
      const { role, token, userId } = data.data.data;

      // store token to local storage
      localStorage.setItem('AUTH_TOKEN', token);

      router.push(`/dashboard`);
    } catch (err) {
      console.error(err);
      error();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder}
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

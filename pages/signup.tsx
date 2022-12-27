import React from 'react';
import Link from 'next/link';
import { Button, Form, Input, Radio } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const SignUp: React.FC = () => {
  const [form] = Form.useForm();

  const validatePassword = (value: string): boolean => {
    // To check a password between 4 to 16 characters which contain at least
    // one lowercase letter, one uppercase letter, one numeric digit, and one special character
    const rule =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,16}$/;

    if (value && value.match(rule)) {
      console.log('Success');
      return true;
    }
    console.error('Error!');
    return false;
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Sign up your account</h1>
      <Form
        form={form}
        layout='vertical'
        style={{ margin: '50px 500px 20px 500px' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          name='role'
          label='Role'
          required
          rules={[{ required: true, message: 'Please select your role!' }]}>
          <Radio.Group>
            <Radio value='student'>Student</Radio>
            <Radio value='teacher'>Teacher</Radio>
            <Radio value='manager'>Manager</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          hasFeedback
          required
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
          label='Password'
          required
          tooltip={{
            title: 'Password is a required field',
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || validatePassword(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    'Your password must be 4 ~ 16 characters long, contain at least one number and have a mixture of uppercase and lowercase letters!'
                  )
                );
              },
            }),
          ]}
          hasFeedback>
          <Input.Password
            size='large'
            placeholder='Please enter password'
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          name='confirm'
          label='Confirm Password'
          dependencies={['password']}
          hasFeedback
          required
          tooltip={{
            title: 'Confirm password is a required field',
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            { required: true, message: 'Please enter your password again!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}>
          <Input.Password
            size='large'
            placeholder='Please enter password again'
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
            block>
            Sign Up
          </Button>
          <br />
          <br />
          Already have an Account?
          <Link href='/login'> Login now!</Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUp;

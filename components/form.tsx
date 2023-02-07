import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Modal, Select } from 'antd';

const { Option } = Select;

interface Values {
  name: string;
  email: string;
  country: string;
  type: number;
}

interface PopUpFormProps {
  open: boolean;
  values: Values;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const countries: string[] = ['China', 'New Zealand', 'Canada', 'Australia'];
const roles: string[] = ['Developer', 'Tester'];

const PopUpForm: React.FC<PopUpFormProps> = ({
  open,
  values = null,
  onCreate,
  onCancel,
}) => {
  const [title, setTitle] = useState('Add');
  const [action, setAction] = useState('Create');

  const [form] = Form.useForm();

  const opts = (arr: string[]) => {
    return arr.map((value) => (
      <Option key={value} value={value}>
        {value}
      </Option>
    ));
  };

  useEffect(() => {
    if (values) {
      let { name, email, country, type } = values;
      console.log('form values', values, name, email, country, type);
      if (name || email || country || type >= 0) {
        setTitle('Edit');
        setAction('Update');
        form.setFieldsValue({
          name,
          email,
          country,
          type,
        });
      } else {
        form.resetFields();
        setTitle('Add');
        setAction('Create');
      }
    }
  }, [form, values]);

  return (
    <Modal
      open={open}
      centered
      title={title + ' Student'}
      okText={action}
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        autoComplete='on'
        name='add / edit student form'>
        {/* autoComplete='off'> */}
        <Divider orientationMargin='0' />

        <Form.Item
          label='Name'
          name='name'
          rules={[{ required: true, message: 'Please enter student name!' }]}>
          <Input placeholder='Please enter student name' allowClear />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: 'Please enter your email',
            },
            {
              type: 'email',
              message:
                'The input is not valid Email! e.g. yourname@example.com',
            },
          ]}>
          <Input placeholder='Please enter student email' allowClear />
        </Form.Item>

        <Form.Item
          label='Area'
          name='country'
          rules={[{ required: true, message: 'Please select area!' }]}>
          <Select placeholder='Please select an area' allowClear>
            {/* {opts(countries)} */}
            {/* countries.map( value => <Option>{value}</Option>) */}
            <Option value='New Zealand'>New Zealand</Option>
            <Option value='Canada'>Canada</Option>
            <Option value='Australia'>Australia</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='Student Type'
          name='type'
          rules={[{ required: true, message: 'Please select student type!' }]}>
          <Select placeholder='Please select a type' allowClear>
            <Option value={1}>Tester</Option>
            <Option value={2}>Developer</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PopUpForm;

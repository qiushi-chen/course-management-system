import React from 'react';
import { Layout } from 'antd';
const { Footer: AntdFooter } = Layout;

const Footer = () => {
  return (
    <>
      <AntdFooter
        style={{
          textAlign: 'center',
        }}>
        {/* Ant Design ©2022 Created by Ant UED */}
      </AntdFooter>
    </>
  );
};

export default Footer;

// import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout as AntdLayout } from 'antd';
const { Content } = AntdLayout;

import Layout from '@/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Content>
        <Component {...pageProps} />
      </Content>
    </Layout>
  );
}

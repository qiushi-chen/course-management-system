import React from 'react';
import { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

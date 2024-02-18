import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { headerNavLinks } from '../data/config';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [current, setCurrent] = React.useState('1');
  const navigate = useNavigate();
  const handleNavigate = (e: any) => {
    const index = e.key - 1 < 0 ? 0 : e.key - 1;
    setCurrent(e.key);
    navigate(headerNavLinks[index].href);
  }

  return (
    <Layout className=' h-screen'>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={headerNavLinks}
          style={{ flex: 1, minWidth: 0 }}
          selectedKeys={[current]}
          onSelect={handleNavigate}
        />
      </Header>
      <Content className='p-11 overflow-y-auto'>
        <div
          className=" bg-slate-200 h-full p-10 rounded-lg"
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default LayoutWrapper;
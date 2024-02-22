import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { headerNavLinks } from '../data/config';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const current = React.useMemo(() => {
    return headerNavLinks.findIndex((link) => link.href === location.pathname) + 1;
  }, [location.pathname]);

  const handleNavigate = (e: any) => {
    const index = e.key - 1 < 0 ? 0 : e.key - 1;
    navigate(headerNavLinks[index].href);
  }

  return (
    <Layout className=' h-screen'>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor:'#818cf8'}} className='flex items-center px-10'>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={headerNavLinks}
          style={{ flex: 1, minWidth: 0 }}
          selectedKeys={[`${current}`]}
          onSelect={handleNavigate}
        />
      </div>
      <Content className='p-11 bg-indigo-100'>
        <div
          className=" h-full p-10 rounded-lg shadow-xl overflow-y-auto bg-white"
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
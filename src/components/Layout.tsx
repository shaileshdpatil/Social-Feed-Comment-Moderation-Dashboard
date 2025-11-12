import React from 'react';
import { Layout as AntLayout, Button } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Social Feed
        </div>
        <Button type="primary" danger onClick={handleLogout}>
          Log Out
        </Button>
      </Header>
      <Content style={{ padding: '0 24px' }}>
        {children}
      </Content>
    </AntLayout>
  );
};
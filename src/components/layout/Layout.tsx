
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const isActiveMenu = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="layout-wrapper">
      <TopBar toggleSidebar={toggleSidebar} />
      <SideBar visible={sidebarVisible} isActiveMenu={isActiveMenu} />
      <div className={`layout-main-container ${sidebarVisible ? 'ml-[300px]' : 'ml-0'}`}>
        <div className="layout-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

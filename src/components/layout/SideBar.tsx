
import React from 'react';
import { Link } from 'react-router-dom';

interface SideBarProps {
  visible: boolean;
  isActiveMenu: (path: string) => boolean;
}

interface MenuItem {
  label: string;
  icon: string;
  path: string;
}

const SideBar: React.FC<SideBarProps> = ({ visible, isActiveMenu }) => {
  const menu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', path: '/' },
    { label: 'Kanban Board', icon: 'pi pi-th-large', path: '/kanban' },
    { label: 'OKR & KPI', icon: 'pi pi-chart-line', path: '/okr-kpi' },
    { label: 'Weekly Notes', icon: 'pi pi-file', path: '/weekly-notes' }
  ];

  return (
    <div className={`layout-sidebar ${visible ? 'visible' : 'hidden'}`}>
      <div className="flex justify-center my-5">
        <div className="text-xl font-bold flex gap-2 items-center text-sakai-primary">
          <i className="pi pi-chart-bar"></i>
          <span>Performance Track</span>
        </div>
      </div>
      <ul className="layout-menu">
        {menu.map((item, i) => (
          <li key={i}>
            <Link 
              to={item.path} 
              className={`${isActiveMenu(item.path) ? 'bg-sakai-primary text-white' : 'hover:bg-sakai-primary-light'} transition-colors duration-200`}
            >
              <i className={`${item.icon} menu-icon`}></i>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;

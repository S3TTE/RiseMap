
import React from 'react';
import { Button } from 'primereact/button';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  return (
    <div className="layout-topbar">
      <Button 
        icon="pi pi-bars" 
        onClick={toggleSidebar} 
        className="p-button-rounded p-button-text p-button-plain menu-button"
        aria-label="Menu"
      />
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-sakai-primary">Team Performance Tracker</h1>
      </div>
      <ul className="topbar-menu">
        <li>
          <Button 
            icon="pi pi-user" 
            className="p-button-rounded p-button-text p-button-plain" 
            aria-label="User"
          />
        </li>
        <li>
          <Button 
            icon="pi pi-bell" 
            className="p-button-rounded p-button-text p-button-plain" 
            aria-label="Notifications"
            badge="2"
            badgeClassName="p-badge-danger"
          />
        </li>
        <li>
          <Button 
            icon="pi pi-cog" 
            className="p-button-rounded p-button-text p-button-plain" 
            aria-label="Settings"
          />
        </li>
      </ul>
    </div>
  );
};

export default TopBar;

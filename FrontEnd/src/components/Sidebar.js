// Sidebar.js
import React from "react";
//import { FaSignOutAlt,FaTimes } from "react-icons/fa";
// Import the PrimeReact Sidebar component
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
//import { Times } from 'primereact/icons';
import Keycloak from "./keycloak.js";
import { useNavigate } from "react-router-dom";
//import '../styles/Sidebar.css'
const SidebarComponent = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear local storage
    localStorage.clear();

    // 2. Logout from keycloak and redirect to login page
    Keycloak.logout({ redirectUri: window.location.origin + "/" });

    // 3. Optional: navigate('/') for safety
    navigate("/");
  };

  // 🛑 Define the items for the Menu component
  const items = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      items: [
        {
          label: "Product Analytics",
          icon: "pi pi-chart-bar",
          command: () => navigate("/product-analytics"),
        },
        {
          label: "User Analytics",
          icon: "pi pi-users",
          command: () => navigate("/user-analytics"),
        },
      ],
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        /* navigate to /profile */
      },
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => {
        /* navigate to /settings */
      },
    },
    {
      label: "Product Tracker",
      icon: "pi pi-table",
      command: () => navigate("/Tracker"),
    },
  ];

  return (
    <Sidebar
      visible={isOpen}
      onHide={onClose}
      style={{ zIndex: 1100 }}
      position="left"
      closeIcon={({ closeCallback }) => (
        <Button
          icon="pi pi-times"
          rounded
          text
          className="h-2rem w-2rem"
          onClick={closeCallback}
        />
      )}
    >
      <div className="flex flex-column h-full">
        <div className="sidebar-content p-4 flex-grow-1">
          <h3>Application Menu</h3>
          <Menu model={items} />
        </div>

        <div className="sidebar-footer p-3">
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            className="p-button-danger w-full"
            onClick={handleLogout}
          />
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;

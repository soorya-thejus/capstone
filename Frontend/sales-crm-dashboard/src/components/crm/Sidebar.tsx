// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../styles/crm/sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <NavLink to="/crm/dashboard" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/crm/deals" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              Deals
            </NavLink>
          </li>
          <li>
            <NavLink to="/crm/leads" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              Leads
            </NavLink>
          </li>
          <li>
            <NavLink to="/crm/contacts" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              Contacts
            </NavLink>
          </li>
          <li>
            <NavLink to="/crm/accounts" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              Accounts
            </NavLink>
          </li>
          <li>
            <NavLink to="/crm/projects" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              Projects
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

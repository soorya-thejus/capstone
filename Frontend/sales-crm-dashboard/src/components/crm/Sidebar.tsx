import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/crm/sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <Link to="/crm/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/crm/deals">Deals</Link>
          </li>
          <li>
            <Link to="/crm/leads">Leads</Link>
          </li>
          <li>
            <Link to="/crm/contacts">Contacts</Link>
          </li>
          <li>
            <Link to="/crm/accounts">Accounts</Link>
          </li>
          <li>
            <Link to="/crm/projects">Projects</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

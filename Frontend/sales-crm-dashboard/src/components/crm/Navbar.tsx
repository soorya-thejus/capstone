// src/components/crm/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import styles from '../../styles/crm/navbar.module.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage to log out
    navigate('/signin'); // Navigate to the signin page
  };

  const navigateToSalesRepSignup = () => {
    navigate('/crm/sales-rep-signup'); // Navigate to Sales Rep signup page
  };

  return (
    <div className={styles.navbar}>
      <h1>Welcome, Admin</h1>
      <div className={styles.profile}>
        <button onClick={toggleMenu} className={styles.profileButton}>
          Profile
        </button>
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={navigateToSalesRepSignup}>Add Sales Rep</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

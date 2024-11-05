// src/components/crm/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/crm/navbar.module.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/crm/signin');
  };

  const navigateToTeamMemberSignup = () => {
    navigate('/crm/team-member-signup'); // Navigate to Team Member signup page
  };

  const role = sessionStorage.getItem("role");

  return (
    <div className={styles.navbar}>
      <h1 className={styles.title}>TRACKLYZE</h1> {/* Added title here */}
      <h2>Welcome, {role}</h2> {/* Optional welcome message */}
      <div className={styles.profile}>
        {role === 'Admin' && (
          <button onClick={navigateToTeamMemberSignup} className={styles.addButton}>Add Team</button>
        )}
        <button onClick={toggleMenu} className={styles.profileButton}>Profile</button>
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

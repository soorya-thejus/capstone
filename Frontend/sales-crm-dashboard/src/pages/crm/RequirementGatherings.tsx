// pages/RequirementGathering.tsx
import React, { useState } from 'react';
import Topbar from '../../components/crm/Topbar';
import styles from '../../styles/crm/auth.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequirementGathering: React.FC = () => {
  const navigate = useNavigate();
  const adminId = sessionStorage.getItem('adminId'); // Get admin ID from session storage

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    contact_info: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminId) {
      setError('Admin ID is missing. Please sign up again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5006/api/orgs', {
        ...formData,
        adminId, // Send the admin ID with the organization details
      });

      if (response.status === 201) {
        navigate('/crm/signin'); // Redirect to dashboard or another page after successful submission
      }
    } catch (err) {
      setError('Error occurred while creating organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Topbar />
      <div className={styles.authContent}>
        <div className={styles.formSection}>
          <h2>Organization Details</h2>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label>Contact Info</label>
            <input
              type="text"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Organization Details'}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RequirementGathering;

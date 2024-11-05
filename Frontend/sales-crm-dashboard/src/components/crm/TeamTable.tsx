// src/pages/crm/Team.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/crm/teamtable.module.css';

interface TeamMember {
  id: string;
  username: string;
  email: string;
  role: string;
}

const TeamTable: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(''); // State for selected role
  const role = sessionStorage.getItem('role');

  const fetchTeamMembersByRole = async (role: string) => {
    const orgId = sessionStorage.getItem('orgId');
    if (!orgId) return;

    try {
      let response;
      if (selectedRole === 'Sales Rep') {
        response = await axios.get(`http://localhost:5007/api/orgs/${orgId}/salesreps`);
      } else if (selectedRole === 'Project Manager') {
        response = await axios.get(`http://localhost:5007/api/orgs/${orgId}/pms`);
      }

      if (response) {
        setTeamMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Clear teamMembers and fetch new data on role change
  useEffect(() => {
    if (selectedRole) {
      setTeamMembers([]); // Clear previous data
      fetchTeamMembersByRole(selectedRole);
    }
  }, [selectedRole]);

  if (role !== 'Admin') {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className={styles.tableContainer}>

      {/* Dropdown for selecting role */}
      <div className={styles.roleSelectContainer}>
        <select
          className={styles.roleDropdown}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Sales Rep">Sales Rep</option>
          <option value="Project Manager">Project Manager</option>
          {/* Add more roles as needed */}
        </select>
      </div>

      {/* Team Table */}
      {selectedRole && teamMembers.length > 0 && (
        <table className={styles.teamTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.username}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeamTable;

// src/pages/crm/Team.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/crm/teamtable.module.css';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const TeamTable: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    const fetchTeam = async () => {
      if (role !== 'Admin') return;

      try {
        const orgId = sessionStorage.getItem('orgId');
        const response = await axios.get(`http://localhost:5007/api/orgs/${orgId}/team`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeam();
  }, [role]);

  if (role !== 'Admin') {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className={styles.tableContainer}>
    <table >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map(member => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;

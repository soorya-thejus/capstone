// src/components/LeadsTable.tsx
import React, { useState } from 'react';
import { Lead } from '../../types/crm/Lead';
import LeadForm from './LeadForm';
import styles from '../../styles/crm/leadstable.module.css';

const initialLeads: Lead[] = [
  { id: 1, name: "Alice Johnson", status: "New Lead", company: "Company A", title: "Manager", email: "alice@companya.com" },
  { id: 2, name: "Bob Brown", status: "Contacted", company: "Company B", title: "Director", email: "bob@companyb.com" },
  // Add more initial leads as needed
];

const LeadsTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddClick = () => {
    setSelectedLead({ id: 0, name: "", status: "New Lead", company: "", title: "", email: "" });
    setIsFormVisible(true);
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleSaveLead = (lead: Lead) => {
    setLeads(prevLeads => {
      if (lead.id === 0) {
        // Add new lead with unique id
        return [...prevLeads, { ...lead, id: prevLeads.length + 1 }];
      } else {
        // Update existing lead
        return prevLeads.map(l => (l.id === lead.id ? lead : l));
      }
    });
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <div className={styles.tableContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>Add Lead</button>
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Status</th>
            <th>Company</th>
            <th>Title</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.status}</td>
              <td>{lead.company}</td>
              <td>{lead.title}</td>
              <td>{lead.email}</td>
              <td>
                <button onClick={() => handleEditClick(lead)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(lead.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && selectedLead && (
        <LeadForm
          lead={selectedLead}
          onSave={handleSaveLead}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default LeadsTable;

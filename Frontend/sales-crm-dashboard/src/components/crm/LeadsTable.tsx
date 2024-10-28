// src/components/LeadsTable.tsx
import React, { useState } from 'react';
import { Lead } from '../../types/crm/Lead';
import LeadForm from './LeadForm';
import styles from '../../styles/crm/leadstable.module.css';

const initialLeads: Lead[] = [
  { id: 1, name: "Alice Johnson", status: "New Lead", company: "Company A", title: "Sales Manager", email: "alice@companya.com" },
  { id: 2, name: "Bob Brown", status: "Attempted to Contact", company: "Company B", title: "CTO", email: "bob@companyb.com" },
];

const LeadsTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleSaveLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => (l.id === lead.id ? lead : l)));
    setSelectedLead(null);
  };

  const handleAddLead = () => {
    setSelectedLead({ id: 0, name: "", status: "New Lead", company: "", title: "", email: "" });
  };

  return (
    <div className={styles.tableContainer}>
      <h2>Leads</h2>
      <button onClick={handleAddLead} className={styles.addButton}>Add Lead</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Company</th>
            <th>Title</th>
            <th>Email</th>
            <th>Edit</th>
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
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLead && (
        <LeadForm
          lead={selectedLead}
          onSave={handleSaveLead}
          onCancel={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
};

export default LeadsTable;

// src/components/LeadsTable.tsx
import React, { useState, useEffect } from 'react';
import { Lead } from '../../types/crm/Lead';
import LeadForm from './LeadForm';
import styles from '../../styles/crm/leadstable.module.css';
import * as leadService from '../../services/LeadService'; // Import the leadService

const LeadsTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch leads when the component mounts
  useEffect(() => {
    const fetchLeads = async () => {
      const fetchedLeads = await leadService.getLeads();
      setLeads(fetchedLeads);
    };
    fetchLeads();
  }, []);

  const handleAddClick = () => {
    setSelectedLead({ lead_name: "", status: "new lead", company: "", title: "", email: "", phone: "" });
    setIsFormVisible(true);
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormVisible(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await leadService.deleteLead(id);
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    let savedLead: Lead; // Explicitly type savedLead
    if (lead.id) {
      // Update existing lead
      savedLead = await leadService.updateLead(lead.id, lead);
    } else {
      // Create new lead
      savedLead = await leadService.createLead(lead);
    }
    setLeads(prevLeads => {
      if (savedLead) {
        if (lead.id) {
          // Update the lead in the state
          return prevLeads.map(existingLead => (existingLead.id === lead.id ? savedLead : existingLead));
        }
        return [...prevLeads, savedLead]; // Add new lead
      }
      return prevLeads;
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
            <th>Phone</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id}>
              <td>{lead.lead_name}</td>
              <td>{lead.status}</td>
              <td>{lead.company}</td>
              <td>{lead.title}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>
                <button onClick={() => handleEditClick(lead)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(lead.id!)}>Delete</button>
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

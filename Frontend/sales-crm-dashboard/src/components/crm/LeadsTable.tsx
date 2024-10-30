import React, { useState, useEffect } from 'react';
import { Lead } from '../../types/crm/Lead';
import LeadForm from './LeadForm';
import styles from '../../styles/crm/leadstable.module.css';
import * as leadService from '../../services/LeadService';

const LeadsTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [orgId] = useState("67221a3f486241a8d7de5ab5"); // Assuming you have a way to get orgId

  useEffect(() => {
    const fetchLeads = async () => {
      const fetchedLeads = await leadService.getLeads();
      setLeads(fetchedLeads);
    };
    fetchLeads();
  }, []);

  const handleAddClick = () => {
    //setSelectedLead({ lead_name: "", status: "contacted", company: "", title: "", email: "", phone: "",org_id:"67221a3f486241a8d7de5ab5" });
    setIsFormVisible(true);
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormVisible(true);
  };

  const handleDeleteClick = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await leadService.deleteLead(_id);
      setLeads(leads.filter(lead => lead._id !== _id));
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    let savedLead: Lead;
    if (lead._id) {
      savedLead = await leadService.updateLead(lead._id, lead);
      setLeads(prevLeads => prevLeads.map(existingLead => (existingLead._id === lead._id ? savedLead : existingLead)));
    } else {
      savedLead = await leadService.createLead({ ...lead, org_id: orgId });
      setLeads(prevLeads => [...prevLeads, savedLead]);
    }
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
            <tr key={lead._id}>
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
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(lead._id!)}>Delete</button>
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
          orgId={orgId} // Pass orgId to LeadForm
        />
      )}
    </div>
  );
};

export default LeadsTable;
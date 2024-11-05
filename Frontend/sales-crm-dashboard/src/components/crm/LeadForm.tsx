import React, { useState, useEffect } from 'react';
import { Lead } from '../../types/crm/Lead';
import styles from '../../styles/crm/leadform.module.css';

interface LeadFormProps {
  lead: Lead;
  onSave: (lead: Lead) => void;
  onCancel: () => void;
  orgId: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onCancel, orgId }) => {
  const [formData, setFormData] = useState<Lead>(lead);
  const [isStatusEditable, setIsStatusEditable] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<string>('');
  const [statusWarning, setStatusWarning] = useState<string>('');

  useEffect(() => {
    setFormData(lead);
    setIsStatusEditable(!(lead.status === "qualified" || lead.status === "unqualified"));
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate email format
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailPattern.test(value) ? '' : 'Please enter a valid email address.');
    }

    // Check for qualified or unqualified status selection
    if (name === "status" && (value === "qualified" || value === "unqualified")) {
      setStatusWarning('You cannot edit the status once it is set to Qualified or Unqualified.');
    } else {
      setStatusWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ownerId = sessionStorage.getItem('userId') || '';

    // Ensure all fields are filled and no status warning
    if (!formData.lead_name || !formData.company || !formData.title || !formData.email || !formData.phone || emailError ) {
      alert('Please fill in all fields, ensure email is valid, and confirm status selection.');
      return;
    }

    onSave({ ...formData, org_id: orgId, owner_id: ownerId });
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{lead._id ? "Edit Lead" : "Add Lead"}</h3>
          <label>
            Name:
            <input type="text" name="lead_name" value={formData.lead_name || ''} onChange={handleChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={formData.status || ''} onChange={handleChange} disabled={!isStatusEditable}>
              <option value="new lead">New Lead</option>
              <option value="attempted to contact">Attempted to Contact</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
            </select>
            {statusWarning && <div className={styles.warning}>{statusWarning}</div>}
          </label>
          <label>
            Company:
            <input type="text" name="company" value={formData.company || ''} onChange={handleChange} required />
          </label>
          <label>
            Title:
            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} required />
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;

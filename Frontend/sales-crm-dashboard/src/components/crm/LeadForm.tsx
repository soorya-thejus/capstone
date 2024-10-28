// src/components/LeadForm.tsx
import React, { useState, useEffect } from 'react';
import { Lead } from '../../types/crm/Lead';
import styles from '../../styles/crm/leadform.module.css';

interface LeadFormProps {
  lead: Lead;
  onSave: (lead: Lead) => void;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Lead>(lead);

  useEffect(() => {
    setFormData(lead);
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.popup}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>{lead.id === 0 ? "Add Lead" : "Edit Lead"}</h3>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="New Lead">New Lead</option>
            <option value="Attempted to Contact">Attempted to Contact</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
        </label>
        <label>
          Company:
          <input type="text" name="company" value={formData.company} onChange={handleChange} />
        </label>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <div className={styles.buttons}>
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;

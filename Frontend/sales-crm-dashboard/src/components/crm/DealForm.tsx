// src/components/DealForm.tsx
import React, { useState, useEffect } from 'react';
import { Deal } from '../../types/crm/Deal';
import styles from '../../styles/crm/dealform.module.css';

interface DealFormProps {
  deal: Deal;
  contacts: { _id: string; contact_name: string }[]; // Expecting contact objects
  onSave: (deal: Deal) => void;
  onCancel: () => void;
}

const DealForm: React.FC<DealFormProps> = ({ deal, contacts, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Deal>(deal);

  useEffect(() => {
    setFormData(deal);
  }, [deal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{deal._id ? 'Edit Deal' : 'Add Deal'}</h3>
          <label>
            Deal Name:
            <input type="text" name="deal_name" value={formData.deal_name} onChange={handleChange} />
          </label>
          <label>
            Stage:
            <select name="stage" value={formData.stage} onChange={handleChange}>
              <option value="new">New</option>
              <option value="discovery">Discovery</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </label>
          <label>
            Deal Value:
            <input type="number" name="deal_value" value={formData.deal_value} onChange={handleChange} />
          </label>
          <label>
            Expected Close Date:
            <input type="date" name="expected_close_date" value={formData.expected_close_date} onChange={handleChange} />
          </label>
          <label>
            Close Probability (%):
            <input type="number" name="close_probability" value={formData.close_probability} onChange={handleChange} />
          </label>
          <label>
            Contact:
            <select name="contact_id" value={formData.contact_id} onChange={handleChange}>
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact._id} value={contact._id}>
                  {contact.contact_name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;

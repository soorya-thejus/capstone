// src/components/DealForm.tsx
import React, { useState, useEffect } from 'react';
import { Deal } from '../../types/crm/Deal';
import styles from '../../styles/crm/dealform.module.css';

interface DealFormProps {
  deal: Deal;
  contacts: { _id: string; contact_name: string }[];
  onSave: (deal: Deal) => void;
  onCancel: () => void;
}

const DealForm: React.FC<DealFormProps> = ({ deal, contacts, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Deal>(deal);
  const [initialStage, setInitialStage] = useState<string | null>(deal.stage);
  const [warning, setWarning] = useState<string | null>('');

  useEffect(() => {
    setFormData(deal);
    setInitialStage(deal.stage);
  }, [deal]);

  const validateField = (name: string, value: any) => {
    // Handle warnings for stage changes
    if (name === "stage") {
      if (value === "won" || value === "lost") {
        setWarning('Once the deal stage is set to Won or Lost, it cannot be modified after saving.');
      } else {
        setWarning('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerId = sessionStorage.getItem('userId') || '';

    // Ensure all fields are filled and valid
    const requiredFields = ["deal_name", "deal_value", "expected_close_date", "contact_id"];
    for (const field of requiredFields) {
      if (!formData[field as keyof Deal]) {
        alert(`Please fill in the ${field.replace(/_/g, ' ')} field.`);
        return;
      }
    }

    // Ensure deal value is positive
    if (formData.deal_value <= 0) {
      alert("Deal value must be a positive number.");
      return;
    }

    onSave({ ...formData, owner_id: ownerId });
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{deal._id ? 'Edit Deal' : 'Add Deal'}</h3>
          <label>
            Deal Name:
            <input
              type="text"
              name="deal_name"
              value={formData.deal_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Stage:
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              disabled={initialStage === "won" || initialStage === "lost"}
            >
              <option value="new">New</option>
              <option value="discovery">Discovery</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </label>
          {warning && <div>{warning}</div>}
          <label>
            Deal Value:
            <input
              type="number"
              name="deal_value"
              value={formData.deal_value}
              onChange={handleChange}
              min="0" // Prevent negative input
            />
          </label>
          <label>
            Expected Close Date:
            <input
              type="date"
              name="expected_close_date"
              value={formData.expected_close_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Contact:
            <select
              name="contact_id"
              value={formData.contact_id}
              onChange={handleChange}
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact._id} value={contact._id}>
                  {contact.contact_name}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={initialStage === "won" || initialStage === "lost"}>Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;

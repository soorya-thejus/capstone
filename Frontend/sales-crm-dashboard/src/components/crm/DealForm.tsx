// src/components/DealForm.tsx
import React, { useState, useEffect } from 'react';
import { Deal } from '../../types/crm/Deal';
import styles from '../../styles/crm/dealform.module.css';

interface DealFormProps {
  deal: Deal;
  onSave: (deal: Deal) => void;
  onCancel: () => void;
}

const DealForm: React.FC<DealFormProps> = ({ deal, onSave, onCancel }) => {
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
        <h3>{deal.id ? 'Edit Deal' : 'Add Deal'}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Deal Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
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
            <input type="number" name="dealValue" value={formData.dealValue} onChange={handleChange} />
          </label>
          <label>
            Expected Close Date:
            <input type="date" name="expectedCloseDate" value={formData.expectedCloseDate} onChange={handleChange} />
          </label>
          <label>
            Close Probability (%):
            <input type="number" name="closeProbability" value={formData.closeProbability} onChange={handleChange} />
          </label>
          <label>
            Forecast Value:
            <input type="number" name="forecastValue" value={formData.forecastValue} onChange={handleChange} />
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

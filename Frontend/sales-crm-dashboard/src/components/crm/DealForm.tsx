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
  const [warning, setWarning] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    setFormData(deal);
    setInitialStage(deal.stage);
  }, [deal]);

  const validateField = (name: string, value: any) => {
    let error: string | null = null; // Explicitly set type of `error` to `string | null`

    if (name === "deal_name" && !value) {
      error = "Deal name is required.";
    } else if (name === "deal_value" && (isNaN(value) || value <= 0)) {
      error = "Deal value must be a positive number.";
    } else if (name === "expected_close_date" && !value) {
      error = "Expected close date is required.";
    } else if (name === "close_probability") {
      if (isNaN(value) || value < 0 || value > 100) {
        error = "Probability must be between 0 and 100.";
      }
    } else if (name === "contact_id" && !value) {
      error = "Contact must be selected.";
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    validateField(name, value);

    if (name === "stage" && (value === "won" || value === "lost")) {
      setWarning("Once the deal stage is set to Won or Lost, it cannot be modified after saving.");
    } else {
      setWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ["deal_name", "deal_value", "expected_close_date", "close_probability", "contact_id"];
    let valid = true;

    requiredFields.forEach(field => {
      if (!formData[field as keyof Deal]) {
        validateField(field, formData[field as keyof Deal]);
        valid = false;
      }
    });

    if (valid) {
      onSave(formData);
    }
  };

  const isFormValid = () => {
    return Object.values(errors).every(error => error === null) &&
      formData.deal_name &&
      formData.deal_value > 0 &&
      formData.expected_close_date &&
      formData.close_probability >= 0 &&
      formData.close_probability <= 100 &&
      formData.contact_id;
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
            {errors.deal_name && <p style={{ color: "red"}}>{errors.deal_name}</p>}
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
          {warning && <p style={{ color: "red" }}>{warning}</p>}
          <label>
            Deal Value:
            <input
              type="number"
              name="deal_value"
              value={formData.deal_value}
              onChange={handleChange}
            />
            {errors.deal_value && <p style={{ color: "red" }}>{errors.deal_value}</p>}
          </label>
          <label>
            Expected Close Date:
            <input
              type="date"
              name="expected_close_date"
              value={formData.expected_close_date}
              onChange={handleChange}
            />
            {errors.expected_close_date && <p style={{ color: "red" }}>{errors.expected_close_date}</p>}
          </label>
          <label>
            Close Probability (%):
            <input
              type="number"
              name="close_probability"
              value={formData.close_probability}
              onChange={handleChange}
            />
            {errors.close_probability && <p style={{ color: "red" }}>{errors.close_probability}</p>}
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
            {errors.contact_id && <p style={{ color: "red" }}>{errors.contact_id}</p>}
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={!isFormValid()}>Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;

// src/components/ContactForm.tsx
import React, { useState, useEffect } from 'react';
import { Contact } from '../../types/crm/Contact';
import styles from '../../styles/crm/contactform.module.css';

interface ContactFormProps {
  contact: Contact;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Contact>(contact);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

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
          <h3>{contact.id ? 'Edit Contact' : 'Add Contact'}</h3>
          <label>
            Name:
            <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} required />
          </label>
          <label>
            Account IDs (comma-separated):
            <input type="text" name="account_ids" value={formData.account_ids.join(', ')} onChange={handleChange} required />
          </label>
          <label>
            Deal IDs (comma-separated):
            <input type="text" name="deal_ids" value={formData.deal_ids.join(', ')} onChange={handleChange} />
          </label>
          <label>
            Project ID:
            <input type="text" name="project_id" value={formData.project_id?.toString()} onChange={handleChange} />
          </label>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            Phone:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Deals Value:
            <input type="number" name="deal_value" value={formData.deal_value} onChange={handleChange} />
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

export default ContactForm;

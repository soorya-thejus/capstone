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
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Account:
            <input type="text" name="account" value={formData.account} onChange={handleChange} required />
          </label>
          <label>
            Deals:
            <input type="text" name="deals" value={formData.deals} onChange={handleChange} />
          </label>
          <label>
            Project:
            <input type="text" name="project" value={formData.project} onChange={handleChange} />
          </label>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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
            <input type="number" name="dealsValue" value={formData.dealsValue} onChange={handleChange} />
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

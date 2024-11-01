// src/components/ContactForm.tsx
import React, { useState, useEffect } from 'react';
import { Contact } from '../../types/crm/Contact';
import { ContactService } from '../../services/ContactService';
import styles from '../../styles/crm/contactform.module.css'; // Importing your existing CSS module

interface ContactFormProps {
  contact?: Contact | null; // Allow null as a valid type
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState<Contact>({
    lead_id: contact?.lead_id || '',
    contact_name: contact?.contact_name || '',
    account_id: contact?.account_id || null,
    deal_ids: contact?.deal_ids || [],
    title: contact?.title || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    priority: contact?.priority || 'low',
    deal_value: 0,
    forecast_value: 0,
    project_ids: contact?.project_ids || [],
    org_id: contact?.org_id || '' // Set this based on logged-in organization
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      const updatedContact = await ContactService.updateContact(contact._id!, formData);
      onSave(updatedContact);
    }
    onClose();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.form}>
        <h3>{contact ? 'Edit Contact' : 'Contact Details'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Contact Name
            <input
              type="text"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </label>
          <label>
            Priority
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit">{contact ? 'Update Contact' : 'Save Contact'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

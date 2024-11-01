// src/components/ContactTable.tsx
import React, { useEffect, useState } from 'react';
import { ContactService } from '../../services/ContactService';
import { Contact } from '../../types/crm/Contact';
import ContactForm from './ContactForm';
import styles from '../../styles/crm/contactstable.module.css'; // Assuming you have this CSS module

const ContactTable: React.FC<{ orgId: string }> = ({ orgId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsData = await ContactService.getAllContacts(orgId);
      setContacts(contactsData);
    };
    fetchContacts();
  }, [orgId]);

  const handleSave = (contact: Contact) => {
    setContacts((prev) => {
      const existingIndex = prev.findIndex(c => c._id === contact._id);
      if (existingIndex >= 0) {
        const updatedContacts = [...prev];
        updatedContacts[existingIndex] = contact;
        return updatedContacts;
      }
      return [...prev, contact];
    });
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setFormVisible(true);
  };

  return (
    <div className={styles.tableContainer}>
      {isFormVisible && (
        <ContactForm contact={selectedContact} onClose={() => setFormVisible(false)} onSave={handleSave} />
      )}
      <table>
        <thead>
          <tr>
            <th>Contact Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.contact_name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.priority}</td>
              <td>
                <button onClick={() => handleEdit(contact)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;

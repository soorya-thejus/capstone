// src/components/ContactsTable.tsx
import React, { useEffect, useState } from 'react';
import { Contact } from '../../types/crm/Contact';
import ContactForm from './ContactForm';
import styles from '../../styles/crm/contactstable.module.css';
import axios from 'axios';

const ContactsTable: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contacts'); // Adjust the URL as per your API
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`/api/contacts/${id}`); // Adjust the URL as per your API
        setContacts(contacts.filter(contact => contact.id !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleSaveContact = async (contact: Contact) => {
    try {
      if (contact.id) {
        // Edit existing contact
        await axios.put(`/api/contacts/${contact.id}`, contact); // Adjust the URL as per your API
        setContacts(prev => prev.map(c => (c.id === contact.id ? contact : c)));
      } else {
        // Add new contact
        const response = await axios.post('/api/contacts', contact); // Adjust the URL as per your API
        setContacts(prev => [...prev, { ...response.data, id: Date.now() }]); // Assuming the API returns the new contact
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    }
    setEditingContact(null); // Close form after saving
  };

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Account</th>
            <th>Deals</th>
            <th>Project</th>
            <th>Priority</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Deals Value</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td>{contact.contact_name}</td>
              <td>{contact.account_ids.join(', ')}</td> {/* Adjust based on how you want to display account IDs */}
              <td>{contact.deal_ids.join(', ')}</td> {/* Adjust based on how you want to display deal IDs */}
              <td>{contact.project_id.toString()}</td> {/* Adjust to show the project name if necessary */}
              <td>{contact.priority}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
              <td>{contact.deal_value}</td>
              <td>
                <button onClick={() => handleEditClick(contact)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(contact.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingContact && (
        <div className={styles.formContainer}>
          <ContactForm
            contact={editingContact}
            onSave={handleSaveContact}
            onCancel={() => setEditingContact(null)} // Close form on cancel
          />
        </div>
      )}
    </div>
  );
};

export default ContactsTable;

// src/components/ContactsTable.tsx
import React, { useState } from 'react';
import { Contact } from '../../types/crm/Contact';
import ContactForm from './ContactForm';
import Modal from './Modal'; // Import the Modal component
import styles from '../../styles/crm/contactstable.module.css';

const initialContacts: Contact[] = [
  { id: 1, name: "John Doe", account: "Account A", deals: "Deal 1", project: "Project 1", priority: "High", phone: "123-456-7890", email: "john@example.com", dealsValue: 1000 },
  { id: 2, name: "Jane Smith", account: "Account B", deals: "Deal 2", project: "Project 2", priority: "Medium", phone: "987-654-3210", email: "jane@example.com", dealsValue: 2000 },
  // Add more initial contacts as needed
];

const ContactsTable: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setModalOpen(true); // Open modal on edit click
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const handleSaveContact = (contact: Contact) => {
    setContacts(prev =>
      prev.some(c => c.id === contact.id)
        ? prev.map(c => (c.id === contact.id ? contact : c))
        : [...prev, { ...contact, id: Date.now() }] // Assign a new ID if adding a new contact
    );
    closeModal(); // Close modal after saving
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContact(null); // Reset selected contact
  };

  return (
    <div className={styles.tableContainer}>
      <h2>Contacts</h2>
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
              <td>{contact.name}</td>
              <td>{contact.account}</td>
              <td>{contact.deals}</td>
              <td>{contact.project}</td>
              <td>{contact.priority}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
              <td>{contact.dealsValue}</td>
              <td>
                <button onClick={() => handleEditClick(contact)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteClick(contact.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedContact && (
        <Modal onClose={closeModal}>
          <ContactForm
            contact={selectedContact}
            onSave={handleSaveContact}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ContactsTable;

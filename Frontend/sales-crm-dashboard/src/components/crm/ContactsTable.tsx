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

  const handleSaveContact = (contact: Contact) => {
    setContacts(prev =>
      prev.map(c => (c.id === contact.id ? contact : c))
    );
    setModalOpen(false); // Close modal after saving
    setSelectedContact(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close modal
    setSelectedContact(null); // Reset selected contact
  };

  return (
    <div className={styles.tableContainer}>
      <h2>Contacts</h2>
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Accounts</th>
            <th>Deals</th>
            <th>Project</th>
            <th>Priority</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Deals Value</th>
            <th>Edit</th>
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
              <td>${contact.dealsValue.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEditClick(contact)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing contact */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedContact && (
          <ContactForm 
            contact={selectedContact} 
            onSave={handleSaveContact} 
          />
        )}
      </Modal>
    </div>
  );
};

export default ContactsTable;

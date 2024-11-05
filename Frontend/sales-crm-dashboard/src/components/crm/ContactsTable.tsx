import React, { useEffect, useState } from 'react';
import { ContactService } from '../../services/ContactService';
import { getAccountsBySalesRep, getAllAccounts } from '../../services/AccountService'; 
import { Contact } from '../../types/crm/Contact';
import styles from '../../styles/crm/contactstable.module.css';
import formStyles from '../../styles/crm/contactform.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface Account {
  _id: string;
  account_name: string;
}

const ContactTable: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAccountPopupVisible, setAccountPopupVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Fetch orgId, ownerId, and role from session storage
  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';

  useEffect(() => {
    const fetchContactsAndAccounts = async () => {
      try {
        let contactsData: Contact[] = [];
        let accountsData: Account[] = [];

        // Fetch contacts based on the role
        if (role === 'Admin') {
          contactsData = await ContactService.getAllContactsByOrgId(orgId);
        } else if (role === 'Sales Rep') {
          contactsData = await ContactService.getAllContactsBySalesRep(orgId, ownerId);
        } else if (role === 'Project Manager') {
          // Fetch all contacts for Project Manager
          contactsData = await ContactService.getAllContactsByOrgId(orgId);
        }

        setContacts(contactsData);

        // Fetch accounts associated with the orgId
        if (role === 'Admin') {
          accountsData = await getAllAccounts(orgId);
        } else if (role === 'Sales Rep') {
          accountsData = await getAccountsBySalesRep(orgId, ownerId);
        } else if (role === 'Project Manager') {
          accountsData = await getAllAccounts(orgId); // Ensure Project Managers can see all accounts
        }
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error fetching contacts and accounts:", error);
      }
    };

    fetchContactsAndAccounts();
  }, [orgId, ownerId, role]);

  const handleAddOrEditAccount = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedAccountId(contact.account_id || null);
    setAccountPopupVisible(true);
  };

  const handleSaveAccount = async () => {
    if (selectedContact && selectedAccountId) {
      const updatedContact = { ...selectedContact, account_id: selectedAccountId };
      await ContactService.updateContact(selectedContact._id!, updatedContact);

      setContacts((prev) =>
        prev.map((contact) => (contact._id === selectedContact._id ? updatedContact : contact))
      );

      setAccountPopupVisible(false);
      setSelectedAccountId(null);
      setSelectedContact(null);
    }
  };

  const getAccountNameById = (accountId: string | null) => {
    const account = accounts.find(acc => acc._id === accountId);
    return account ? account.account_name : 'No Account';
  };

  return (
    <div className={styles.tableContainer}>
      {isAccountPopupVisible && (
        <div className={formStyles.popupOverlay}>
          <div className={formStyles.popup}>
            <div className={formStyles.form}>
              <h3>Select an Account</h3>
              <select
                value={selectedAccountId || ''}
                onChange={(e) => setSelectedAccountId(e.target.value)}
              >
                <option value="" disabled>Select an Account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
              <div className={formStyles.buttonGroup}>
                <button onClick={handleSaveAccount} type="submit">Save</button>
                <button onClick={() => setAccountPopupVisible(false)} type="button">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Contact Name</th>
            <th>Account</th>
            <th>Deals</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Deals Value</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.contact_name}</td>
              <td>
                {contact.account_id ? (
                  <>
                    {getAccountNameById(contact.account_id)}
                    {/* Render edit icon only if the user is not a Project Manager */}
                    {role !== 'Project Manager' && (
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleAddOrEditAccount(contact)}
                        className={styles.editIcon}
                      />
                    )}
                  </>
                ) : (
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => role !== 'Project Manager' && handleAddOrEditAccount(contact)}
                    className={styles.editIcon}
                  />
                )}
              </td>
              <td>{contact.deal_ids?.length || 0}</td>
              <td>{contact.title}</td>
              <td>{contact.priority}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
              <td>{contact.deal_value ? `$${contact.deal_value.toLocaleString()}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;

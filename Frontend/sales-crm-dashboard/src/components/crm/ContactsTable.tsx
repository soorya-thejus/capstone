import React, { useEffect, useState } from 'react';
import { ContactService } from '../../services/ContactService';
import { getAccountsBySalesRep, getAllAccounts } from '../../services/AccountService'; 
import { Contact } from '../../types/crm/Contact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTable, faTh } from '@fortawesome/free-solid-svg-icons';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isTableView, setIsTableView] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Change this value to display more or fewer items per page

  // Fetch orgId, ownerId, and role from session storage
  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';

  useEffect(() => {
    const fetchContactsAndAccounts = async () => {
      try {
        let contactsData: Contact[] = [];
        let accountsData: Account[] = [];

        if (role === 'Admin' || role === 'Project Manager') {
          contactsData = await ContactService.getAllContactsByOrgId(orgId);
          accountsData = await getAllAccounts(orgId);
        } else if (role === 'Sales Rep') {
          contactsData = await ContactService.getAllContactsBySalesRep(orgId, ownerId);
          accountsData = await getAccountsBySalesRep(orgId, ownerId);
        }
        setContacts(contactsData);
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

  const getAccountNameById = (accountId: string | null|undefined) => {
    const account = accounts.find(acc => acc._id === accountId);
    return account ? account.account_name : 'No Account';
  };

  const filteredContacts = contacts.filter(contact =>
    contact.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Toolbar with search, add button, and view toggle */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Contacts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm w-1/3"
        />
        <FontAwesomeIcon
          icon={isTableView ? faTh : faTable}
          onClick={() => setIsTableView(!isTableView)}
          className="text-gray-600 cursor-pointer hover:text-gray-800 text-xl ml-4"
        />
      </div>

      {isAccountPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Select an Account</h3>
            <select
              value={selectedAccountId || ''}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select an Account</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.account_name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSaveAccount}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setAccountPopupVisible(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isTableView ? (
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Contact Name</th>
              <th className="py-2 px-4 border-b">Account</th>
              <th className="py-2 px-4 border-b">Deals</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Priority</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Deals Value</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map(contact => (
              <tr key={contact._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{contact.contact_name}</td>
                <td className="py-2 px-4 border-b flex items-center space-x-2">
                  <span>{getAccountNameById(contact.account_id)}</span>
                  {role !== 'Project Manager' && (
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleAddOrEditAccount(contact)}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    />
                  )}
                </td>
                <td className="py-2 px-4 border-b">{contact.deal_ids?.length || 0}</td>
                <td className="py-2 px-4 border-b">{contact.title}</td>
                <td className="py-2 px-4 border-b">{contact.priority}</td>
                <td className="py-2 px-4 border-b">{contact.phone}</td>
                <td className="py-2 px-4 border-b">{contact.email}</td>
                <td className="py-2 px-4 border-b">
                  {contact.deal_value ? `$${contact.deal_value.toLocaleString()}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentContacts.map(contact => (
            <div key={contact._id} className="p-4 border border-gray-200 rounded-md shadow">
              <h3 className="text-lg font-semibold mb-2">{contact.contact_name}</h3>
              <p className="text-gray-600">Account: {getAccountNameById(contact.account_id)}</p>
              <p className="text-gray-600">Title: {contact.title}</p>
              <p className="text-gray-600">Phone: {contact.phone}</p>
              <p className="text-gray-600">Email: {contact.email}</p>
              <p className="text-gray-600">Priority: {contact.priority}</p>
              <p className="text-gray-600">Deals Value: ${contact.deal_value?.toLocaleString()}</p>
              {role !== 'Project Manager' && (
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => handleAddOrEditAccount(contact)}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredContacts.length / itemsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredContacts.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactTable;

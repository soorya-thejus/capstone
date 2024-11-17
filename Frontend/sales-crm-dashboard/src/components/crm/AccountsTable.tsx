import React, { useState, useEffect } from 'react';
import { Account } from '../../types/crm/Account';
import AccountForm from './AccountForm';
import * as accountService from '../../services/AccountService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faTable, faTh } from '@fortawesome/free-solid-svg-icons';

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditing, setEditing] = useState(false);
  const [isTableView, setIsTableView] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 5;

  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let data: Account[] = [];
        if (role === 'Admin' || role === 'Project Manager') {
          data = await accountService.getAllAccounts(orgId);
        } else if (role === 'Sales Rep') {
          data = await accountService.getAccountsBySalesRep(orgId, ownerId);
        }
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (error) {
        console.error('Error fetching accounts', error);
      }
    };
    fetchAccounts();
  }, [orgId, ownerId, role]);

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setEditing(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountService.deleteAccount(id);
        setAccounts(accounts.filter(account => account._id !== id));
        setFilteredAccounts(filteredAccounts.filter(account => account._id !== id));
      } catch (error) {
        console.error('Error deleting account', error);
      }
    }
  };

  const handleAddClick = () => {
    setSelectedAccount({
      _id: '',
      account_name: '',
      priority: 'medium',
      industry: '',
      description: '',
      number_of_employees: 0,
      org_id: orgId,
      owner_id: ownerId,
    });
    setEditing(true);
  };

  const handleToggleView = () => {
    setIsTableView(!isTableView);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAccounts(
      accounts.filter(account =>
        account.account_name.toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  };

  const currentAccounts = filteredAccounts.slice(
    (currentPage - 1) * accountsPerPage,
    currentPage * accountsPerPage
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center mb-4 justify-between">
        {/* Add Account button for Sales Rep */}
        {role === 'Sales Rep' && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-black text-white rounded-md shadow flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Account</span>
          </button>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search accounts"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-md shadow-sm w-1/3"
        />

        {/* Toggle View Icon for Admin and Project Manager */}
        {(role === 'Admin' || role === 'Project Manager' || role === 'Sales Rep') && (
          <FontAwesomeIcon
            icon={isTableView ? faTh : faTable}
            onClick={handleToggleView}
            className="text-gray-600 cursor-pointer hover:text-gray-800 text-xl"
          />
        )}
      </div>

      {isEditing && role !== 'Project Manager' && (
        <AccountForm
          account={selectedAccount || {
            _id: '',
            account_name: '',
            priority: 'medium',
            industry: '',
            description: '',
            number_of_employees: 0,
            org_id: orgId,
            owner_id: ownerId,
          }}
          onSave={async account => {
            const updatedAccounts = account._id
              ? await accountService.updateAccount(account._id, account)
              : await accountService.createAccount({ ...account, org_id: orgId });
            setAccounts(prevAccounts =>
              account._id
                ? prevAccounts.map(a => (a._id === account._id ? account : a))
                : [...prevAccounts, account]
            );
            setEditing(false);
            setSelectedAccount(null);
          }}
          onCancel={() => {
            setEditing(false);
            setSelectedAccount(null);
          }}
        />
      )}

      {isTableView ? (
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Account Name</th>
              <th className="py-2 px-4 border-b">Priority</th>
              <th className="py-2 px-4 border-b">Industry</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Employees</th>
              {role !== 'Project Manager' && <th className="py-2 px-4 border-b">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map(account => (
              <tr key={account._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{account.account_name}</td>
                <td className="py-2 px-4 border-b">{account.priority}</td>
                <td className="py-2 px-4 border-b">{account.industry}</td>
                <td className="py-2 px-4 border-b">{account.description}</td>
                <td className="py-2 px-4 border-b">{account.number_of_employees}</td>
                {role !== 'Project Manager' && (
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => handleEditClick(account)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => account._id && handleDeleteClick(account._id)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentAccounts.map(account => (
            <div
              key={account._id}
              className="p-4 border border-gray-200 rounded-md shadow-lg bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">{account.account_name}</h3>
              <p className="text-gray-600">
                <span className="font-semibold">Priority:</span> {account.priority}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Industry:</span> {account.industry}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Description:</span> {account.description}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Employees:</span> {account.number_of_employees}
              </p>
              {role !== 'Project Manager' && (
                <div className="flex space-x-4 mt-4">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={() => handleEditClick(account)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => account._id && handleDeleteClick(account._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccountsTable;

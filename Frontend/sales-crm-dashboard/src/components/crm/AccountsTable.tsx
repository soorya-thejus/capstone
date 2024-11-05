import React, { useState, useEffect } from 'react';
import { Account } from '../../types/crm/Account';
import AccountForm from './AccountForm';
import * as accountService from '../../services/AccountService';
import styles from '../../styles/crm/accountstable.module.css';

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditing, setEditing] = useState(false);

  // Fetch orgId, ownerId, and role from session storage
  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';

  // Fetch all accounts based on role on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let data: Account[] = [];

        // Admins can view all accounts, Sales Reps can only view their accounts
        if (role === 'Admin') {
          data = await accountService.getAllAccounts(orgId);
        } else if (role === 'Sales Rep') {
          data = await accountService.getAccountsBySalesRep(orgId, ownerId);
        } else if (role === 'Project Manager') {
          // Project Managers can view all accounts
          data = await accountService.getAllAccounts(orgId);
        }

        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts", error);
      }
    };
    fetchAccounts();
  }, [orgId, ownerId, role]);

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setEditing(true);
  };

  const handleDeleteClick = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await accountService.deleteAccount(_id);
        setAccounts(accounts.filter(account => account._id !== _id));
      } catch (error) {
        console.error("Error deleting account", error);
      }
    }
  };

  const handleSaveAccount = async (account: Account) => {
    try {
      if (!account._id) {
        // Creating a new account, include org_id
        const newAccount = await accountService.createAccount({ ...account, org_id: orgId });
        setAccounts([...accounts, newAccount]);
      } else {
        const updatedAccount = await accountService.updateAccount(account._id, account);
        setAccounts(accounts.map(a => (a._id === updatedAccount._id ? updatedAccount : a)));
      }
      setEditing(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error("Error saving account", error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedAccount(null);
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

  return (
    <div className={styles.tableContainer}>
      {/* Show Add Account button only for Admin and Sales Rep */}
      {(role === 'Admin' || role === 'Sales Rep') && (
        <button
          className={styles.addButton}
          onClick={handleAddClick}
        >
          Add Account
        </button>
      )}
      
      {isEditing && (role !== 'Project Manager') && (
        <AccountForm
          account={selectedAccount || {
            _id: '',
            account_name: '',
            priority: 'medium',
            industry: '',
            description: '',
            number_of_employees: 0,
            org_id: orgId,
            owner_id: ownerId
          }}
          onSave={handleSaveAccount}
          onCancel={handleCancel}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Priority</th>
            <th>Industry</th>
            <th>Description</th>
            <th>Employees</th>
            {role !== 'Project Manager' && <th>Edit</th>}
            {role !== 'Project Manager' && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account._id}>
              <td>{account.account_name}</td>
              <td>{account.priority}</td>
              <td>{account.industry}</td>
              <td>{account.description}</td>
              <td>{account.number_of_employees}</td>
              {role !== 'Project Manager' && (
                <td>
                  <button onClick={() => handleEditClick(account)}>Edit</button>
                </td>
              )}
              {role !== 'Project Manager' && (
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => account._id && handleDeleteClick(account._id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;

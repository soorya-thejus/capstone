import React, { useState, useEffect } from 'react';
import { Account } from '../../types/crm/Account';
import AccountForm from './AccountForm';
import * as accountService from '../../services/AccountService';
import styles from '../../styles/crm/accountstable.module.css';

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditing, setEditing] = useState(false);

  // Fetch all accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getAllAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts", error);
      }
    };
    fetchAccounts();
  }, []);

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
    console.log("Saving account:", account); // Debugging line
    try {
      if (!account._id) { // Check if _id is not present for new accounts
        const newAccount = await accountService.createAccount(account);
        console.log("Created new account:", newAccount); // Debugging line
        setAccounts([...accounts, newAccount]);
      } else {
        const updatedAccount = await accountService.updateAccount(account._id, account);
        console.log("Updated account:", updatedAccount); // Debugging line
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
      _id: '', // Ensure the ID is a string for MongoDB
      account_name: '',
      priority: 'medium',
      industry: '',
      description: '',
      number_of_employees: 0,
    });
    setEditing(true);
  };

  return (
    <div className={styles.tableContainer}>
      <button
        className={styles.addButton}
        onClick={handleAddClick}
      >
        Add Account
      </button>
      
      {isEditing && (
        <AccountForm
          account={selectedAccount || {
            _id: '',
            account_name: '',
            priority: 'medium',
            industry: '',
            description: '',
            number_of_employees: 0,
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
            <th>Edit</th>
            <th>Delete</th>
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
              <td>
                <button onClick={() => handleEditClick(account)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(account._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;

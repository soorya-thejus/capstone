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

  // Handle edit click to open the form with selected account data
  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setEditing(true);
  };

  // Handle delete click with a confirmation dialog
  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await accountService.deleteAccount(id);
        setAccounts(accounts.filter(account => account.id !== id));
      } catch (error) {
        console.error("Error deleting account", error);
      }
    }
  };

  // Handle saving an account, either updating or creating it
  const handleSaveAccount = async (account: Account) => {
    try {
      if (account.id === 0) {
        // Create new account
        const newAccount = await accountService.createAccount(account);
        setAccounts([...accounts, newAccount]);
      } else {
        // Update existing account
        const updatedAccount = await accountService.updateAccount(account.id, account);
        setAccounts(accounts.map(a => (a.id === updatedAccount.id ? updatedAccount : a)));
      }
      setEditing(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error("Error saving account", error);
    }
  };

  // Handle cancel action in the form
  const handleCancel = () => {
    setEditing(false);
    setSelectedAccount(null);
  };

  return (
    <div className={styles.tableContainer}>
      <button
        className={styles.addButton}
        onClick={() => {
          setSelectedAccount({ id: 0, account_name: "", priority: "medium", industry: "", description: "", number_of_employees: 0 });
          setEditing(true);
        }}
      >
        Add Account
      </button>
      
      {isEditing && (
        <AccountForm
          account={selectedAccount || { id: 0, account_name: "", priority: "medium", industry: "", description: "", number_of_employees: 0 }}
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
            <tr key={account.id}>
              <td>{account.account_name}</td>
              <td>{account.priority}</td>
              <td>{account.industry}</td>
              <td>{account.description}</td>
              <td>{account.number_of_employees}</td>
              <td>
                <button onClick={() => handleEditClick(account)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;

// src/components/AccountsTable.tsx
import React, { useState } from 'react';
import { Account } from '../../types/crm/Account';
import AccountForm from './AccountForm';
import styles from '../../styles/crm/accountstable.module.css';

const initialAccounts: Account[] = [
  { id: 1, name: "Tech Corp", priority: "High", industry: "Technology", description: "Leading tech solutions provider", numEmployees: 500, hqLocation: "San Francisco, CA" },
  { id: 2, name: "Finance Solutions", priority: "Medium", industry: "Finance", description: "Financial advisory and consulting", numEmployees: 200, hqLocation: "New York, NY" },
];

const AccountsTable: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditing, setEditing] = useState(false);

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setEditing(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter(account => account.id !== id));
    }
  };

  const handleSaveAccount = (account: Account) => {
    setAccounts(prev =>
      prev.some(a => a.id === account.id)
        ? prev.map(a => (a.id === account.id ? account : a))
        : [...prev, { ...account, id: Date.now() }]
    );
    setEditing(false);
    setSelectedAccount(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setSelectedAccount(null);
  };

  return (
    <div className={styles.tableContainer}>
      <button
        className={styles.addButton}
        onClick={() => {
          setSelectedAccount({ id: 0, name: "", priority: "Medium", industry: "", description: "", numEmployees: 0, hqLocation: "" });
          setEditing(true);
        }}
      >
        Add Account
      </button>
      
      {isEditing && (
        <AccountForm
          account={selectedAccount || { id: 0, name: "", priority: "Medium", industry: "", description: "", numEmployees: 0, hqLocation: "" }}
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
            <th>HQ Location</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.priority}</td>
              <td>{account.industry}</td>
              <td>{account.description}</td>
              <td>{account.numEmployees}</td>
              <td>{account.hqLocation}</td>
              <td>
                <button onClick={() => handleEditClick(account)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteClick(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;

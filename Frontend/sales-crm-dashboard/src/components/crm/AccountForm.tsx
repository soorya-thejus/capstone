// src/components/AccountForm.tsx
import React, { useState, useEffect } from 'react';
import { Account } from '../../types/crm/Account';
import styles from '../../styles/crm/accountform.module.css';

interface AccountFormProps {
  account: Account;
  onSave: (account: Account) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Account>(account);

  useEffect(() => {
    setFormData(account);
  }, [account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{account.id ? 'Edit Account' : 'Add Account'}</h3>
          <label>
            Account Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>
            Industry:
            <input type="text" name="industry" value={formData.industry} onChange={handleChange} />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={formData.description} onChange={handleChange} />
          </label>
          <label>
            Number of Employees:
            <input type="number" name="numEmployees" value={formData.numEmployees} onChange={handleChange} />
          </label>
          <label>
            Headquarters Location:
            <input type="text" name="hqLocation" value={formData.hqLocation} onChange={handleChange} />
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;

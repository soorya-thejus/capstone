import React, { useState, useEffect } from 'react';
import { Account } from '../../types/crm/Account';
import styles from '../../styles/crm/accountform.module.css';

interface AccountFormProps {
  account: Account;
  onSave: (account: Account) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onSave, onCancel }) => {
  // Retrieve orgId and userId (for owner_id) from session storage
  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';

  const [formData, setFormData] = useState<Account>({
    _id: "",
    account_name: "",
    priority: "medium",
    industry: "",
    description: "",
    number_of_employees: 0,
    org_id: orgId,  // Set orgId from session storage
    owner_id: ownerId // Set ownerId from session storage
  });

  useEffect(() => {
    if (account._id) {
      // Editing an existing account, so set form data to provided account
      setFormData(account);
    } else {
      // Reset to default values for a new account
      setFormData({
        _id: "",
        account_name: "",
        priority: "medium",
        industry: "",
        description: "",
        number_of_employees: 0,
        org_id: orgId,  // Ensure orgId is set for new account
        owner_id: ownerId // Ensure ownerId is set for new account
      });
    }
  }, [account, orgId, ownerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debugging line
    onSave(formData); // Pass formData directly; _id will be handled by the backend
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{account._id ? 'Edit Account' : 'Add Account'}</h3>
          <label>
            Account Name:
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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
            <input
              type="number"
              name="number_of_employees"
              value={formData.number_of_employees}
              onChange={handleChange}
            />
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

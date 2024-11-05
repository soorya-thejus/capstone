// src/components/DealsTable.tsx
import React, { useState, useEffect } from 'react';
import { Deal } from '../../types/crm/Deal';
import { Contact } from '../../types/crm/Contact';
import DealForm from './DealForm';
import { ContactService } from '../../services/ContactService';
import { DealService } from '../../services/DealService';
import styles from '../../styles/crm/dealstable.module.css';

const DealsTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';

  useEffect(() => {
    const fetchContacts = async () => {
      let fetchedContacts;
      if (role === 'Admin') {
        // Fetch all contacts for the organization
        fetchedContacts = await ContactService.getAllContactsByOrgId(orgId);
      } else if (role === 'Sales Rep') {
        // Fetch contacts for the sales representative
        fetchedContacts = await ContactService.getAllContactsBySalesRep(orgId, ownerId);
      }
      setContacts(fetchedContacts || []);
    };

    const fetchDeals = async () => {
      let fetchedDeals;
      if (role === 'Admin') {
        // Fetch all deals for the organization
        fetchedDeals = await DealService.getAllDealsByOrgId(orgId);
      } else if (role === 'Sales Rep') {
        // Fetch deals for the sales representative
        fetchedDeals = await DealService.getAllDealsBySalesRep(orgId, ownerId);
      }
      setDeals(fetchedDeals || []);
    };

    fetchContacts();
    fetchDeals();
  }, [orgId, ownerId, role]);

  const handleAddClick = () => {
    setSelectedDeal({
      deal_name: "",
      stage: "new",
      deal_value: 0,
      expected_close_date: "",
      close_probability: 0,
      forecast_value: 0,
      contact_id: "",
      org_id: orgId,
      owner_id: ownerId,
    });
    setIsFormVisible(true);
  };

  const handleEditClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      DealService.deleteDeal(id).then(() => {
        setDeals(deals.filter(deal => deal._id !== id));
      });
    }
  };

  const handleSaveDeal = async (deal: Deal) => {
    if (!deal._id) {
      const { _id, ...newDealData } = deal;
      try {
        const createdDeal = await DealService.createDeal(newDealData);
        setDeals(prevDeals => [...prevDeals, createdDeal]);
      } catch (error) {
        console.error("Error creating deal:", error);
      }
    } else {
      try {
        const updatedDeal = await DealService.updateDeal(deal._id, deal);
        setDeals(prevDeals => prevDeals.map(d => (d._id === updatedDeal._id ? updatedDeal : d)));
      } catch (error) {
        console.error("Error updating deal:", error);
      }
    }
    setIsFormVisible(false);
    setSelectedDeal(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedDeal(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.tableContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>Add Deal</button>
      <table>
        <thead>
          <tr>
            <th>Deal Name</th>
            <th>Stage</th>
            <th>Deal Value</th>
            <th>Expected Close Date</th>
            <th>Contact</th>
            <th>Account</th>
            <th>Close Probability</th>
            <th>Forecast Value</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => (
            <tr key={deal._id}>
              <td>{deal.deal_name}</td>
              <td>{deal.stage}</td>
              <td>{deal.deal_value}</td>
              <td>{formatDate(deal.expected_close_date)}</td>
              <td>{contacts.find(contact => contact._id === deal.contact_id)?.contact_name}</td>
              <td>{contacts.find(contact => contact._id === deal.contact_id)?.contact_name}</td>
              <td>{deal.close_probability}</td>
              <td>{deal.forecast_value}</td>
              
              <td>
              <button onClick={() => handleEditClick(deal)}>Edit</button>
              </td>
              <td>
                <button
                  className={`${styles.deleteButton} ${deal.stage === 'won' || deal.stage === 'lost' ? styles.disabledDeleteButton : ''}`}
                  onClick={() => handleDeleteClick(deal._id!)}
                  disabled={deal.stage === 'won' || deal.stage === 'lost'}>
                  Delete
                </button>
              </td>

              
            </tr>
          ))}
        </tbody>
      </table>
      {isFormVisible && selectedDeal && (
        <DealForm deal={selectedDeal} contacts={contacts as { _id: string; contact_name: string }[]} onSave={handleSaveDeal} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default DealsTable;

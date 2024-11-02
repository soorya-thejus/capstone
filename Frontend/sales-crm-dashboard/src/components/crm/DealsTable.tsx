// src/components/DealsTable.tsx
import React, { useState, useEffect } from 'react';
import { Deal } from '../../types/crm/Deal';
import { Contact } from '../../types/crm/Contact';
import DealForm from './DealForm';
import { ContactService } from '../../services/ContactService';
import { DealService } from '../../services/DealService';
import styles from '../../styles/crm/dealstable.module.css';

interface DealsTableProps {
  orgId: string; // Pass orgId as prop
}

const DealsTable: React.FC<DealsTableProps> = ({ orgId }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const fetchedContacts = await ContactService.getAllContacts(orgId);
      setContacts(fetchedContacts);
    };

    const fetchDeals = async () => {
      const fetchedDeals = await DealService.getAllDeals(orgId);
      setDeals(fetchedDeals);
    };

    fetchContacts();
    fetchDeals();
  }, [orgId]);

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
            <th>Close Probability</th>
            <th>Forecast Value</th>
            <th>Contact</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => {
            const contact = contacts.find(contact => contact._id === deal.contact_id);
            return (
              <tr key={deal._id}>
                <td>{deal.deal_name}</td>
                <td>{deal.stage}</td>
                <td>{deal.deal_value}</td>
                <td>{formatDate(deal.expected_close_date)}</td> {/* Format the expected close date */}
                <td>{deal.close_probability}%</td>
                <td>{deal.forecast_value}</td>
                <td>{contact ? contact.contact_name : "N/A"}</td> {/* Display the contact name */}
                <td>
                  <button onClick={() => handleEditClick(deal)}>Edit</button>
                </td>
                <td>
                  <button className={styles.deleteButton} onClick={() => {
                    if (deal._id) {
                      handleDeleteClick(deal._id);
                    }
                  }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isFormVisible && selectedDeal && (
        <DealForm
          deal={selectedDeal}
          contacts={contacts as { _id: string; contact_name: string }[]} // Cast to the expected type
          onSave={handleSaveDeal}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default DealsTable;

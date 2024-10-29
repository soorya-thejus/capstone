// src/components/DealsTable.tsx
import React, { useState } from 'react';
import { Deal } from '../../types/crm/Deal';
import DealForm from './DealForm';
import styles from '../../styles/crm/dealstable.module.css';

const initialDeals: Deal[] = [
  {
    id: 1,
    name: "Deal A",
    stage: "New",
    dealValue: 10000,
    expectedCloseDate: "2024-12-15",
    closeProbability: 50,
    forecastValue: 5000,
  },
  // Add more initial deals as needed
];

const DealsTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddClick = () => {
    setSelectedDeal({
      id: 0,
      name: "",
      stage: "New",
      dealValue: 0,
      expectedCloseDate: "",
      closeProbability: 0,
      forecastValue: 0,
    });
    setIsFormVisible(true);
  };

  const handleEditClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      setDeals(deals.filter(deal => deal.id !== id));
    }
  };

  const handleSaveDeal = (deal: Deal) => {
    setDeals(prevDeals => {
      if (deal.id === 0) {
        // Add new deal with unique id
        return [...prevDeals, { ...deal, id: prevDeals.length + 1 }];
      } else {
        // Update existing deal
        return prevDeals.map(d => (d.id === deal.id ? deal : d));
      }
    });
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <div className={styles.tableContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>Add Deal</button>
      <table>
        <thead>
          <tr>
            <th>Deal</th>
            <th>Stage</th>
            <th>Deal Value</th>
            <th>Expected Close Date</th>
            <th>Close Probability</th>
            <th>Forecast Value</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => (
            <tr key={deal.id}>
              <td>{deal.name}</td>
              <td>{deal.stage}</td>
              <td>{deal.dealValue}</td>
              <td>{deal.expectedCloseDate}</td>
              <td>{deal.closeProbability}</td>
              <td>{deal.forecastValue}</td>
              <td>
                <button onClick={() => handleEditClick(deal)}>Edit</button>
              </td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(deal.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormVisible && selectedDeal && (
        <DealForm
          deal={selectedDeal}
          onSave={handleSaveDeal}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default DealsTable;

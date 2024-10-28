// src/components/DealsTable.tsx
import React, { useState } from 'react';
import { Deal } from '../../types/crm/Deal';
import DealForm from './DealForm';
import styles from '../../styles/crm/dealstable.module.css';

const initialDeals: Deal[] = [
  { id: 1, name: "Deal 1", stage: "new", dealValue: 5000, expectedCloseDate: "2024-12-01", closeProbability: 50, forecastValue: 2500 },
  { id: 2, name: "Deal 2", stage: "negotiation", dealValue: 15000, expectedCloseDate: "2024-11-15", closeProbability: 80, forecastValue: 12000 },
];

const DealsTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const handleEditClick = (deal: Deal) => setSelectedDeal(deal);
  
  const handleSaveDeal = (deal: Deal) => {
    if (deal.id) {
      setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
    } else {
      setDeals(prev => [...prev, { ...deal, id: prev.length + 1 }]);
    }
    setSelectedDeal(null);
  };

  const handleAddClick = () => setSelectedDeal({ id: 0, name: "", stage: "new", dealValue: 0, expectedCloseDate: "", closeProbability: 0, forecastValue: 0 });

  return (
    <div className={styles.tableContainer}>
      <h2>Deals</h2>
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
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => (
            <tr key={deal.id}>
              <td>{deal.name}</td>
              <td>{deal.stage}</td>
              <td>${deal.dealValue.toFixed(2)}</td>
              <td>{deal.expectedCloseDate}</td>
              <td>{deal.closeProbability}%</td>
              <td>${deal.forecastValue.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEditClick(deal)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDeal && (
        <DealForm 
          deal={selectedDeal} 
          onSave={handleSaveDeal} 
          onCancel={() => setSelectedDeal(null)} 
        />
      )}
    </div>
  );
};

export default DealsTable;

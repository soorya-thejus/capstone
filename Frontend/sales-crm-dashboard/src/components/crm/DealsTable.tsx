import React, { useState, useEffect } from 'react';
import { Deal } from '../../types/crm/Deal';
import { Contact } from '../../types/crm/Contact';
import DealForm from './DealForm';
import { ContactService } from '../../services/ContactService';
import { DealService } from '../../services/DealService';
import { getAccount } from '../../services/AccountService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faTable, faTh } from '@fortawesome/free-solid-svg-icons';

const DealsTable: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accountNames, setAccountNames] = useState<{ [key: string]: string }>({});
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableView, setIsTableView] = useState(true);

  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';
  const dealsPerPage = 5;

  useEffect(() => {
    const fetchContacts = async () => {
      let fetchedContacts;
      if (role === 'Admin') {
        fetchedContacts = await ContactService.getAllContactsByOrgId(orgId);
      } else if (role === 'Sales Rep') {
        fetchedContacts = await ContactService.getAllContactsBySalesRep(orgId, ownerId);
      } else {
        fetchedContacts = await ContactService.getAllContactsByOrgId(orgId);
      }
      setContacts(fetchedContacts || []);
    };

    const fetchDeals = async () => {
      let fetchedDeals;
      if (role === 'Admin' || role === 'Project Manager') {
        fetchedDeals = await DealService.getAllDealsByOrgId(orgId);
      } else if (role === 'Sales Rep') {
        fetchedDeals = await DealService.getAllDealsBySalesRep(orgId, ownerId);
      }
      setDeals(fetchedDeals || []);
    };

    fetchContacts();
    fetchDeals();
  }, [orgId, ownerId, role]);

  useEffect(() => {
    const fetchAccountNames = async () => {
      const newAccountNames: { [key: string]: string } = {};
      const fetchedAccountIds = new Set<string>();

      for (const contact of contacts) {
        const accountId = contact.account_id;
        if (accountId && !fetchedAccountIds.has(accountId)) {
          try {
            const accountData = await getAccount(accountId);
            newAccountNames[accountId] = accountData.account_name || "Unknown Account";
            fetchedAccountIds.add(accountId);
          } catch (error) {
            newAccountNames[accountId] = "Unknown Account";
          }
        }
      }

      if (Object.keys(newAccountNames).length > 0) {
        setAccountNames(prevAccountNames => ({ ...prevAccountNames, ...newAccountNames }));
      }
    };

    if (contacts.length > 0) {
      fetchAccountNames();
    }
  }, [contacts]);

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

  const handleDeleteClick = (id: string | undefined) => {
    if (id && window.confirm("Are you sure you want to delete this deal?")) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const currentDeals = deals
    .filter(deal => deal.deal_name.toLowerCase().includes(searchTerm))
    .slice((currentPage - 1) * dealsPerPage, currentPage * dealsPerPage);

  const totalPages = Math.ceil(deals.length / dealsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center mb-4 justify-between">
        {/* Render the Add Deal Button only for Sales Rep */}
        {role === 'Sales Rep' && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-black text-white rounded-md shadow flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Deal</span>
          </button>
        )}

        {/* Search bar should align to the left if no Add button */}
        <input
          type="text"
          placeholder="Search deals"
          value={searchTerm}
          onChange={handleSearchChange}
          className={`px-4 py-2 border rounded-md shadow-sm w-1/3`}
        />

        {/* View toggle */}
        <FontAwesomeIcon
          icon={isTableView ? faTh : faTable}
          onClick={() => setIsTableView(!isTableView)}
          className="text-gray-600 cursor-pointer hover:text-gray-800 text-xl ml-4"
        />
      </div>

      {isFormVisible && (
        <DealForm
          deal={selectedDeal!}
          contacts={contacts as { _id: string; contact_name: string }[]}
          onSave={handleSaveDeal}
          onCancel={handleCancel}
        />
      )}

      {isTableView ? (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Deal Name</th>
              <th className="py-2 px-4 border-b">Stage</th>
              <th className="py-2 px-4 border-b">Value</th>
              <th className="py-2 px-4 border-b">Expected Close Date</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Account</th>
              <th className="py-2 px-4 border-b">Probability</th>
              <th className="py-2 px-4 border-b">Forecast Value</th>
              {role !== 'Project Manager' && <th className="py-2 px-4 border-b">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentDeals.map(deal => {
              const contact = contacts.find(contact => contact._id === deal.contact_id);
              const accountName = contact?.account_id ? accountNames[contact.account_id] : "Unknown Account";
              return (
                <tr key={deal._id}>
                  <td className="py-2 px-4 border-b">{deal.deal_name}</td>
                  <td className="py-2 px-4 border-b">{deal.stage}</td>
                  <td className="py-2 px-4 border-b">{deal.deal_value}</td>
                  <td className="py-2 px-4 border-b">{formatDate(deal.expected_close_date)}</td>
                  <td className="py-2 px-4 border-b">{contact?.contact_name || "Unknown Contact"}</td>
                  <td className="py-2 px-4 border-b">{accountName}</td>
                  <td className="py-2 px-4 border-b">{deal.close_probability}%</td>
                  <td className="py-2 px-4 border-b">{deal.forecast_value}</td>
                  {role !== 'Project Manager' && (
  <td className="py-2 px-4 border-b border-r align-middle">
    <div className="space-x-2">
      {/* Disable edit and delete for won deals */}
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => deal.stage !== 'won' && handleEditClick(deal)} // Prevent action if won
        className={`cursor-pointer ${deal.stage === 'won' ? 'opacity-50 cursor-not-allowed' : 'text-blue-500'}`}
      />
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() => deal.stage !== 'won' && handleDeleteClick(deal._id)} // Prevent action if won
        className={`cursor-pointer ${deal.stage === 'won' ? 'opacity-50 cursor-not-allowed' : 'text-red-500'}`}
      />
    </div>
  </td>
)}

                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentDeals.map(deal => {
            const contact = contacts.find(contact => contact._id === deal.contact_id);
            const accountName = contact?.account_id ? accountNames[contact.account_id] : "Unknown Account";
            return (
              <div key={deal._id} className="bg-gray-100 p-4 rounded-lg shadow">
  <h3 className="text-xl font-bold">{deal.deal_name}</h3>
  <p className="text-gray-600">Stage: {deal.stage}</p>
  <p className="text-gray-600">Value: {deal.deal_value}</p>
  <p className="text-gray-600">Expected Close Date: {formatDate(deal.expected_close_date)}</p>
  <p className="text-gray-600">Contact: {contact?.contact_name || "Unknown Contact"}</p>
  <p className="text-gray-600">Account: {accountName}</p>
  <p className="text-gray-600">Probability: {deal.close_probability}%</p>
  <p className="text-gray-600">Forecast Value: {deal.forecast_value}</p>
  {role !== 'Project Manager' && (
  <div className="flex space-x-2 mt-4">
<FontAwesomeIcon
  icon={faEdit}
  onClick={() => deal.stage !== 'won' && handleEditClick(deal)} // Prevent action if won
  className={`cursor-pointer ${deal.stage === 'won' ? 'text-blue-400 opacity-50 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700'}`}
/>
<FontAwesomeIcon
  icon={faTrash}
  onClick={() => deal.stage !== 'won' && handleDeleteClick(deal._id)} // Prevent action if won
  className={`cursor-pointer ${deal.stage === 'won' ? 'text-red-400 opacity-50 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
/>



  </div>
)}

</div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DealsTable;

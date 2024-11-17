import React, { useState, useEffect } from 'react';
import { Lead } from '../../types/crm/Lead';
import LeadForm from './LeadForm';
import styles from '../../styles/crm/leadstable.module.css';
import * as leadService from '../../services/LeadService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faTable, faTh } from '@fortawesome/free-solid-svg-icons';

const LeadsTable: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableView, setIsTableView] = useState(true);

  const orgId = sessionStorage.getItem('orgId') || '';
  const ownerId = sessionStorage.getItem('userId') || '';
  const role = sessionStorage.getItem('role') || '';
  const leadsPerPage = 5;

  useEffect(() => {
    const fetchLeads = async () => {
      let fetchedLeads;
      if (role === 'Admin') {
        fetchedLeads = await leadService.getLeadsByOrgId(orgId);
      } else if (role === 'Sales Rep') {
        fetchedLeads = await leadService.getLeadsBySalesRep(orgId, ownerId);
      } else if (role === 'Project Manager') {
        fetchedLeads = await leadService.getLeadsByOrgId(orgId);
      }
      setLeads(fetchedLeads || []);
    };
    fetchLeads();
  }, [orgId, ownerId, role]);

  const handleAddClick = () => {
    setSelectedLead({
      lead_name: "",
      status: "new lead",
      company: "",
      title: "",
      email: "",
      phone: "",
      org_id: orgId,
      owner_id: ownerId,
    });
    setIsFormVisible(true);
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormVisible(true);
  };

  const handleDeleteClick = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await leadService.deleteLead(_id);
      setLeads(leads.filter(lead => lead._id !== _id));
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    let savedLead: Lead;
    if (lead._id) {
      savedLead = await leadService.updateLead(lead._id, lead);
      setLeads(prevLeads => prevLeads.map(existingLead => (existingLead._id === lead._id ? savedLead : existingLead)));
    } else {
      savedLead = await leadService.createLead({ ...lead, org_id: orgId });
      setLeads(prevLeads => [...prevLeads, savedLead]);
    }
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const currentLeads = leads
    .filter(lead => lead.lead_name.toLowerCase().includes(searchTerm))
    .slice((currentPage - 1) * leadsPerPage, currentPage * leadsPerPage);

  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-4 justify-between">
        {/* Render the Add Lead Button only for Sales Rep */}
        {role === 'Sales Rep' && (
          <button
            onClick={handleAddClick}
            className="px-6 py-2 bg-black text-white rounded-md shadow flex items-center space-x-2 hover:bg-gray-800"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Lead</span>
          </button>
        )}

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search leads"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-md shadow-sm w-1/3"
        />

        {/* View toggle */}
        <FontAwesomeIcon
          icon={isTableView ? faTh : faTable}
          onClick={() => setIsTableView(!isTableView)}
          className="text-gray-600 cursor-pointer hover:text-gray-800 text-xl ml-4"
        />
      </div>

      {isFormVisible && selectedLead && (
        <LeadForm
          lead={selectedLead}
          onSave={handleSaveLead}
          onCancel={handleCancel}
          orgId={orgId}
        />
      )}

      {isTableView ? (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left">Lead</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b text-left">Company</th>
              <th className="px-4 py-2 border-b text-left">Title</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Phone</th>
              {(role === 'Admin' || role === 'Sales Rep') && (
                <>
                  <th className="px-4 py-2 border-b">Edit</th>
                  <th className="px-4 py-2 border-b">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentLeads.map(lead => (
              <tr key={lead._id}>
                <td className="px-4 py-2 border-b">{lead.lead_name}</td>
                <td className="px-4 py-2 border-b">{lead.status}</td>
                <td className="px-4 py-2 border-b">{lead.company}</td>
                <td className="px-4 py-2 border-b">{lead.title}</td>
                <td className="px-4 py-2 border-b">{lead.email}</td>
                <td className="px-4 py-2 border-b">{lead.phone}</td>
                {(role === 'Admin' || role === 'Sales Rep') && (
                  <>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleEditClick(lead)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className={`text-red-500 hover:text-red-700 ${lead.status === 'qualified' || lead.status === 'unqualified' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleDeleteClick(lead._id!)}
                        disabled={lead.status === 'qualified' || lead.status === 'unqualified'}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentLeads.map(lead => (
            <div key={lead._id} className="p-4 border rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-semibold text-lg">{lead.lead_name}</h3>
              <p>Status: {lead.status}</p>
              <p>Company: {lead.company}</p>
              <p>Title: {lead.title}</p>
              <p>Email: {lead.email}</p>
              <p>Phone: {lead.phone}</p>
              {(role === 'Admin' || role === 'Sales Rep') && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEditClick(lead)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(lead._id!)}
                    className={`text-red-500 hover:text-red-700 ${lead.status === 'qualified' || lead.status === 'unqualified' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={lead.status === 'qualified' || lead.status === 'unqualified'}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadsTable;

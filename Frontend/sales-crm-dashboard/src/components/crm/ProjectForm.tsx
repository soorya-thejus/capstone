// src/components/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { Project } from '../../types/crm/Project';
import styles from '../../styles/crm/projectform.module.css'; // Ensure you're importing your CSS correctly
import { ContactService } from '../../services/ContactService'; // Correctly importing ContactService

interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
  orgId: string; // Pass orgId to the form
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel, orgId }) => {
  const [formData, setFormData] = useState<Project>(project);
  const [contacts, setContacts] = useState<any[]>([]); // Update type according to your contact structure
  const [loading, setLoading] = useState<boolean>(true); // Loading state for contacts

  useEffect(() => {
    setFormData(project);
    fetchContacts(); // Fetch contacts when the component mounts
  }, [project]);

  const fetchContacts = async () => {
    try {
      const response = await ContactService.getAllContacts(orgId);
      console.log('Fetched contacts:', response); // Debugging line to check fetched contacts
      setContacts(response); // Assuming response is an array of contacts
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  //creater me

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      org_id: orgId, // Ensure org_id is set from prop
      contact_id: formData.contact_id || '', // Ensure contact_id is included
    });
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{project._id ? 'Edit Project' : 'Add Project'}</h3>
          <label>
            Name:
            <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} required />
          </label>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange} required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            Start Date:
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
          </label>
          <label>
            End Date:
            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="not started">Not Started</option>
              <option value="working on it">Working on it</option>
              <option value="stuck">Stuck</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label>
            Contact:
            {loading ? (
              <p>Loading contacts...</p>
            ) : (
              <select name="contact_id" value={formData.contact_id} onChange={handleChange} required>
                <option value="">Select a contact</option>
                {contacts.length > 0 ? (
                  contacts.map(contact => (
                    <option key={contact._id} value={contact._id}>
                      {contact.contact_name} {/* Use contact_name instead of name */}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No contacts available</option>
                )}
              </select>
            )}
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

export default ProjectForm;

// src/components/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { Project } from '../../types/crm/Project';
import styles from '../../styles/crm/projectform.module.css';

interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Project>(project);

  useEffect(() => {
    setFormData(project);
  }, [project]);

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
          <h3>{project.id ? 'Edit Project' : 'Add Project'}</h3>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Priority:
            <select name="priority" value={formData.priority} onChange={handleChange} required>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>
            Start Date:
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </label>
          <label>
            End Date:
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
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

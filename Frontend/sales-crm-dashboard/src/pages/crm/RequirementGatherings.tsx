import React, { useState } from 'react';

const RequirementGathering: React.FC = () => {
  const [requirements, setRequirements] = useState({ industry: '', goals: '', teamSize: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRequirements({ ...requirements, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit requirements data
    console.log('Requirements:', requirements);
  };

  return (
    <div className="requirement-gathering">
      <h2>Tell Us About Your Organization</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Industry:
          <input type="text" name="industry" value={requirements.industry} onChange={handleChange} required />
        </label>
        <label>
          Goals:
          <input type="text" name="goals" value={requirements.goals} onChange={handleChange} required />
        </label>
        <label>
          Team Size:
          <select name="teamSize" value={requirements.teamSize} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-100">51-100</option>
            <option value="100+">100+</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RequirementGathering;

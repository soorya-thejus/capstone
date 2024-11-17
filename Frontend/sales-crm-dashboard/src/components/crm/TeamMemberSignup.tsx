import React, { useState, useEffect } from 'react';
import { registerTeamMember } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const TeamMemberSignup: React.FC = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [role, setRole] = useState('Sales Rep');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrgId = sessionStorage.getItem('orgId');
    if (storedOrgId) {
      setOrgId(storedOrgId);
    }
  }, []);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter.');
    } else if (!hasNumber) {
      setPasswordError('Password must contain at least one number.');
    } else {
      setPasswordError(null); 
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (passwordError) {
      setMessage('Please correct the password errors before submitting.');
      return;
    }

    if (!orgId) {
      setMessage("Organization ID is required.");
      return;
    }

    try {
      await registerTeamMember({ org_id: orgId as string, username, email, password, role });
      setMessage(`${role} successfully signed up!`);
      setIsSubmitted(true); // Set submitted state to true
    } catch (error) {
      setMessage('Error signing up Team Member.');
    }
  };

  const handleBack = () => {
    navigate('/crm/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      {!isSubmitted ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-4">Signup Team Member</h2>
          <div className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-lg font-semibold" htmlFor="username">Username:</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold" htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold" htmlFor="password">Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold" htmlFor="role">Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Project Manager">Project Manager</option>
                  <option value="Sales Rep">Sales Rep</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400"
                >
                  Go Back to Dashboard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Sign Up Team Member
                </button>
              </div>
            </form>
            {message && <p className="text-center text-red-500 mt-4">{message}</p>}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-green-500 text-lg mb-4">{message}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-300 text-white rounded-md hover:bg-gray-400"
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamMemberSignup;

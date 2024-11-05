import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/crm/Signup';
import Signin from './pages/crm/Signin';
import RequirementGathering from './pages/crm/RequirementGatherings';
import Dashboard from './pages/crm/Dashboard';
import Contacts from './pages/crm/Contacts';
import Leads from './pages/crm/Leads';
import Projects from './pages/crm/Projects';
import Deals from './pages/crm/Deals';
import Accounts from './pages/crm/Accounts';
import Team from './pages/crm/Team';
import TeamMemberSignup from './components/crm/TeamMemberSignup';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/crm/signup" element={<Signup />} />
      <Route path="/crm/signin" element={<Signin />} />
      <Route path="/crm/requirements" element={<RequirementGathering />} />
      <Route path="/crm/dashboard" element={<Dashboard />} />
      <Route path="/crm/contacts" element={<Contacts />} />
      <Route path="/crm/leads" element={<Leads />} />
      <Route path="/crm/projects" element={<Projects />} />
      <Route path="/crm/deals" element={<Deals />} />
      <Route path="/crm/accounts" element={<Accounts />} />
      <Route path="/crm/requirement-gathering" element={<RequirementGathering />} />
      <Route path="/crm/team-member-signup" element={<TeamMemberSignup />} />
      <Route path="/crm/team" element={<Team />} />

    </Routes>
  );
};

export default AppRoutes;

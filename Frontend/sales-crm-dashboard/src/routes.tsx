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

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/requirements" element={<RequirementGathering />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/deals" element={<Deals />} />

    </Routes>
  );
};

export default AppRoutes;

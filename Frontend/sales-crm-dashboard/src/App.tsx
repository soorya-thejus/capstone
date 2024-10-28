import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/crm/Signup';
import Signin from './pages/crm/Signin';
import Dashboard from './pages/crm/Dashboard';
import Leads from './pages/crm//Leads';
import Projects from './pages/crm/Projects';
import Deals from './pages/crm/Deals';
import Contacts from './pages/crm/Contacts';
import Accounts from './pages/crm/Accounts';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/accounts" element={<Accounts />} />

      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="notifications" element={<div className="animate-fade-in"><h1>Notifications Log</h1><p>Trigger history coming soon...</p></div>} />
          <Route path="analytics" element={<div className="animate-fade-in"><h1>Advanced Analytics</h1><p>Geospatial heatmaps coming soon...</p></div>} />
          <Route path="settings" element={<div className="animate-fade-in"><h1>Admin Settings</h1><p>Manage users and API keys...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import CitizenHome from './components/citizen/CitizenHome';
import CitizenSubmitFeedback from './components/citizen/CitizenSubmitFeedback';
import LeaderDashboard from './components/leader/LeaderDashboard';
import LeaderHouseholds from './components/leader/LeaderHouseholds';
import LeaderResidents from './components/leader/LeaderResidents';
import LeaderFeedback from './components/leader/LeaderFeedback';
import LeaderReports from './components/leader/LeaderReports';
import OfficialFeedbackList from './components/official/OfficialFeedbackList';
import OfficialFeedbackDetail from './components/official/OfficialFeedbackDetail';
import OfficialReports from './components/official/OfficialReports';
import AdminAccounts from './components/admin/AdminAccounts';
import AdminRoles from './components/admin/AdminRoles';
import AdminSettings from './components/admin/AdminSettings';
import AdminLogs from './components/admin/AdminLogs';

export type UserRole = 'citizen' | 'leader' | 'official' | 'admin' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState('');

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          userRole ? <Navigate to={`/${userRole}`} /> : <Login onLogin={handleLogin} />
        } />
        
        {/* Citizen Routes */}
        <Route path="/citizen" element={
          userRole === 'citizen' ? <CitizenHome userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/citizen/submit-feedback" element={
          userRole === 'citizen' ? <CitizenSubmitFeedback onLogout={handleLogout} /> : <Navigate to="/" />
        } />

        {/* Leader Routes */}
        <Route path="/leader" element={
          userRole === 'leader' ? <LeaderDashboard userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/households" element={
          userRole === 'leader' ? <LeaderHouseholds onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/residents" element={
          userRole === 'leader' ? <LeaderResidents onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/feedback" element={
          userRole === 'leader' ? <LeaderFeedback onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/reports" element={
          userRole === 'leader' ? <LeaderReports onLogout={handleLogout} /> : <Navigate to="/" />
        } />

        {/* Official Routes */}
        <Route path="/official" element={
          userRole === 'official' ? <OfficialFeedbackList userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/official/feedback/:id" element={
          userRole === 'official' ? <OfficialFeedbackDetail onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/official/reports" element={
          userRole === 'official' ? <OfficialReports userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          userRole === 'admin' ? <AdminAccounts userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/roles" element={
          userRole === 'admin' ? <AdminRoles onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/settings" element={
          userRole === 'admin' ? <AdminSettings onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/logs" element={
          userRole === 'admin' ? <AdminLogs onLogout={handleLogout} /> : <Navigate to="/" />
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;

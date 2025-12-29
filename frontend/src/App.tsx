import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminAccountCreate from './components/admin/AdminAccountCreate';
import AdminAccountEdit from './components/admin/AdminAccountEdit';
import AdminAccountLock from './components/admin/AdminAccountLock';
import AdminAccountResetPassword from './components/admin/AdminAccountResetPassword';
import AdminAccounts from './components/admin/AdminAccounts';
import AdminLogs from './components/admin/AdminLogs';
import AdminLogsExport from './components/admin/AdminLogsExport';
import AdminRoleDelete from './components/admin/AdminRoleDelete';
import AdminRoleDetail from './components/admin/AdminRoleDetail';
import AdminRoleEdit from './components/admin/AdminRoleEdit';
import AdminRoles from './components/admin/AdminRoles';
import AdminSettings from './components/admin/AdminSettings';
import CitizenChangePassword from './components/citizen/CitizenChangePassword';
import CitizenHome from './components/citizen/CitizenHome';
import CitizenProfile from './components/citizen/CitizenProfile';
import CitizenSubmitFeedback from './components/citizen/CitizenSubmitFeedback';
import LeaderDashboard from './components/leader/LeaderDashboard';
import LeaderFeedback from './components/leader/LeaderFeedback';
import LeaderFeedbackCreate from './components/leader/LeaderFeedbackCreate';
import LeaderFeedbackDetail from './components/leader/LeaderFeedbackDetail';
import LeaderHouseholdCreate from './components/leader/LeaderHouseholdCreate';
import LeaderHouseholdDelete from './components/leader/LeaderHouseholdDelete';
import LeaderHouseholdEdit from './components/leader/LeaderHouseholdEdit';
import LeaderHouseholds from './components/leader/LeaderHouseholds';
import LeaderReports from './components/leader/LeaderReports';
import LeaderResidentCreate from './components/leader/LeaderResidentCreate';
import LeaderResidentDelete from './components/leader/LeaderResidentDelete';
import LeaderResidentEdit from './components/leader/LeaderResidentEdit';
import LeaderResidents from './components/leader/LeaderResidents';
import OfficialFeedbackDetail from './components/official/OfficialFeedbackDetail';
import OfficialFeedbackList from './components/official/OfficialFeedbackList';
import OfficialHouseholdDetail from './components/official/OfficialHouseholdDetail';
import OfficialHouseholds from './components/official/OfficialHouseholds';
import OfficialReports from './components/official/OfficialReports';

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
        <Route path="/citizen/profile" element={
          userRole === 'citizen' ? <CitizenProfile onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/citizen/change-password" element={
          userRole === 'citizen' ? <CitizenChangePassword onLogout={handleLogout} /> : <Navigate to="/" />
        } />

        {/* Leader Routes */}
        <Route path="/leader" element={
          userRole === 'leader' ? <LeaderDashboard userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/households" element={
          userRole === 'leader' ? <LeaderHouseholds onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/households/create" element={
          userRole === 'leader' ? <LeaderHouseholdCreate onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/households/:id/edit" element={
          userRole === 'leader' ? <LeaderHouseholdEdit onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/households/:id/delete" element={
          userRole === 'leader' ? <LeaderHouseholdDelete onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/residents" element={
          userRole === 'leader' ? <LeaderResidents onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/residents/create" element={
          userRole === 'leader' ? <LeaderResidentCreate onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/residents/:id/edit" element={
          userRole === 'leader' ? <LeaderResidentEdit onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/residents/:id/delete" element={
          userRole === 'leader' ? <LeaderResidentDelete onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/feedback" element={
          userRole === 'leader' ? <LeaderFeedback onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/feedback/create" element={
          userRole === 'leader' ? <LeaderFeedbackCreate onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/leader/feedback/:id" element={
          userRole === 'leader' ? <LeaderFeedbackDetail onLogout={handleLogout} /> : <Navigate to="/" />
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
        <Route path="/official/households" element={
          userRole === 'official' ? <OfficialHouseholds onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/official/households/:id" element={
          userRole === 'official' ? <OfficialHouseholdDetail onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/official/reports" element={
          userRole === 'official' ? <OfficialReports userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          userRole === 'admin' ? <AdminAccounts userName={userName} onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/accounts/create" element={
          userRole === 'admin' ? <AdminAccountCreate onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/accounts/:id/edit" element={
          userRole === 'admin' ? <AdminAccountEdit onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/accounts/:id/reset-password" element={
          userRole === 'admin' ? <AdminAccountResetPassword onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/accounts/:id/lock" element={
          userRole === 'admin' ? <AdminAccountLock onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/roles" element={
          userRole === 'admin' ? <AdminRoles onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/roles/:id/edit" element={
          userRole === 'admin' ? <AdminRoleEdit onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/roles/:id/detail" element={
          userRole === 'admin' ? <AdminRoleDetail onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/roles/:id/delete" element={
          userRole === 'admin' ? <AdminRoleDelete onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/settings" element={
          userRole === 'admin' ? <AdminSettings onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/logs" element={
          userRole === 'admin' ? <AdminLogs onLogout={handleLogout} /> : <Navigate to="/" />
        } />
        <Route path="/admin/logs/export" element={
          userRole === 'admin' ? <AdminLogsExport onLogout={handleLogout} /> : <Navigate to="/" />
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import AddLeadPage from './pages/AddLeadPage';
import LeadDetailPage from './pages/LeadDetailPage';
import EditLeadPage from './pages/EditLeadPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            }
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <Layout>
                  <LeadsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddLeadPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <LeadDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditLeadPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

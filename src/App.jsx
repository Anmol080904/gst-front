import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InvoiceForm from './pages/InvoiceForm';
import InvoiceList from './pages/InvoiceList';
import GSTRReport from './pages/GSTRReport';
import ITCTracker from './pages/ITCTracker';
import UserProfile from './pages/UserProfile';
import MonthlySummary from './pages/MonthlySummary';
import ExportCenter from './pages/ExportCenter';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import PrivateRoute from './pages/PrivateRoute';
import HomePage from './pages/Home';
import Signup from './pages/SignUp';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        {/* <Route path="/signup" element={<SignUp />}/> */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/invoice/create" element={<PrivateRoute><InvoiceForm /></PrivateRoute>} />
        <Route path="/invoice/list" element={<PrivateRoute><InvoiceList /></PrivateRoute>} />
        <Route path="/gstr-reports" element={<PrivateRoute><GSTRReport /></PrivateRoute>} />
        <Route path="/itc-tracker" element={<PrivateRoute><ITCTracker /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/monthly-summary" element={<PrivateRoute><MonthlySummary /></PrivateRoute>} />
        <Route path="/export-center" element={<PrivateRoute><ExportCenter /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;

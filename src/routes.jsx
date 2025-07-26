import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import InvoiceForm from "./pages/InvoiceForm";
import InvoiceList from "./pages/InvoiceList";
import GSTRReport from "./pages/GSTRReport";
import ITCTracker from "./pages/ITCTracker";
import UserProfile from "./pages/UserProfile";
import MonthlySummary from "./pages/MonthlySummary";
import ExportCenter from "./pages/ExportCenter";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/gstr-report" element={<GSTRReport />} />
        <Route path="/itc-tracker" element={<ITCTracker />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/monthly-summary" element={<MonthlySummary />} />
        <Route path="/export-center" element={<ExportCenter />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

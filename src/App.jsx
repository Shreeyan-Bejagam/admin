import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Common Components
import Login from "./Components/Login";

// Admin Components
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Departments from "./Components/Departments";
import Employee from "./Components/Employee";
import Assets from "./Components/Assets";
import Attendance from "./Components/Attendance";
import AssetLog from "./Components/AssetLog";
import AddDepartment from "./Components/AddDepartment";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import AddAsset from "./Components/AddAsset";
import EditAsset from "./Components/EditAsset";
import ViewEmployee from "./Components/ViewEmployee";
import Tasks from "./Components/Tasks";
import ViewDepartmentEmployees from "./Components/ViewDepartmentEmployees";
import ViewInterns from "./Components/ViewInterns";
import ViewEmployeeDetails from "./Components/ViewEmployeeDetails";
import ViewInternDetails from "./Components/ViewInternDetails";

// MD Components
import MDDashboard from "./Components/MDDashboard";
import Approvals from "./Components/Approvals";

// Accounts TL Components
import AccountsDashboard from "./Components/Accounts/Dashboard";
import AccountsExpenses from "./Components/Accounts/Expenses";
import AccountsSalaries from "./Components/Accounts/Salaries";
import AccountsVendorPayments from "./Components/Accounts/VendorPayments";

// Finance TL Components
import FinanceDashboard from "./Components/FinanceDashboard";
import FinanceExpenses from "./Components/Accounts/Expenses";
import FinanceSalaries from "./Components/Accounts/Salaries";
import FinanceVendorPayments from "./Components/Accounts/VendorPayments";

// Procurement TL Components
import ProcurementDashboard from "./Components/Procurement/Dashboard";
import ProcurementInventory from "./Components/Procurement/Inventory";
import ProcurementPurchaseOrders from "./Components/Procurement/PurchaseOrders";
import ProcurementVendorManagement from "./Components/Procurement/VendorManagement";

// Shared IndentForm for All Roles
import IndentForm from "./Components/IndentForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Default route redirects to Admin Login */}
        <Route path="/" element={<Login />} />
        <Route path="/adminlogin" element={<Login />} />

        {/* ✅ Admin Dashboard Section */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="departments" element={<Departments />} />
          <Route path="employee" element={<Employee />} />
          <Route path="assets" element={<Assets />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assetlogs" element={<AssetLog />} />
          <Route path="add_department" element={<AddDepartment />} />
          <Route path="add_employee" element={<AddEmployee />} />
          <Route path="edit_employee/:id" element={<EditEmployee />} />
          <Route path="add_asset" element={<AddAsset />} />
          <Route path="edit_asset/:id" element={<EditAsset />} />
          <Route path="employee/:id" element={<ViewEmployee />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="view_department/:id" element={<ViewDepartmentEmployees />} />
          <Route path="view_interns" element={<ViewInterns />} />
          <Route path="view_employee/:id" element={<ViewEmployeeDetails />} />
          <Route path="view_intern/:id" element={<ViewInternDetails />} />
        </Route>

        {/* ✅ MD Dashboard Section */}
        <Route path="/md-dashboard" element={<MDDashboard />}>
          <Route index element={<Home />} />
          <Route path="departments" element={<Departments />} />
          <Route path="employees" element={<Employee />} />
          <Route path="assets" element={<Assets />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assetlogs" element={<AssetLog />} />
          <Route path="approvals" element={<Approvals role="MD" />} />
          <Route path="review_indent/:id" element={<IndentForm role="MD" />} />
        </Route>

        {/* ✅ Accounts TL Dashboard Section */}
        <Route path="/accounts-dashboard" element={<AccountsDashboard />}>
          <Route index element={<Home />} />
          <Route path="expenses" element={<AccountsExpenses />} />
          <Route path="salaries" element={<AccountsSalaries />} />
          <Route path="vendor-payments" element={<AccountsVendorPayments />} />
          <Route path="approvals" element={<Approvals role="AccountsTL" />} /> {/* Added Approvals for AccountsTL */}
          <Route path="review_indent/:id" element={<IndentForm role="AccountsTL" />} />
        </Route>

        {/* ✅ Finance TL Dashboard Section */}
        <Route path="/finance-dashboard" element={<FinanceDashboard />}>
          <Route index element={<Home />} />
          <Route path="expenses" element={<FinanceExpenses />} />
          <Route path="salaries" element={<FinanceSalaries />} />
          <Route path="vendor-payments" element={<FinanceVendorPayments />} />
          <Route path="approvals" element={<Approvals role="FinanceTL" />} /> {/* Added Approvals for FinanceTL */}
          <Route path="review_indent/:id" element={<IndentForm role="FinanceTL" />} />
        </Route>
        
        {/* ✅ Procurement TL Dashboard Section */}
        <Route path="/procurement-dashboard" element={<ProcurementDashboard />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<ProcurementInventory />} />
          <Route path="purchase-orders" element={<ProcurementPurchaseOrders />} />
          <Route path="vendor-management" element={<ProcurementVendorManagement />} />
          <Route path="approvals" element={<Approvals role="ProcurementTL" />} /> {/* Added Approvals for ProcurementTL */}
          <Route path="review_indent/:id" element={<IndentForm role="ProcurementTL" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

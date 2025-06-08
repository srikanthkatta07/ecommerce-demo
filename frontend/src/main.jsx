import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Products from './pages/Products';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import CreateCategory from './pages/CreateCategory';
import Admin from './pages/Admin';
import ManageProducts from './pages/ManageProducts';
import ManageCategories from './pages/ManageCategories';
import AdminDashboard from './pages/AdminDashboard';

const root = createRoot(document.getElementById('root'));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : null;
  return role === 'ADMIN' ? children : <Navigate to="/" />;
};

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create-category"
          element={
            <AdminRoute>
              <CreateCategory />
            </AdminRoute>
          }
        />
        <Route
          path="/create-product"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/delete-category"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/delete-product"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/manage-categories"
          element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  </StrictMode>,
)

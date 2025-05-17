import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Hero from "./pages/Hero";
import Layout from "./components/Layout";
import Models from "./pages/Model";
import Dashboard from "./pages/Dashboard";
import Cost from "./pages/Cost";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/models"
            element={
              <ProtectedRoute>
                <Models />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cost"
            element={
              <ProtectedRoute>
                <Cost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

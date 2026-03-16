import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TestIntegration from "./components/TestIntegration";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<TestIntegration />} />
          {/* Protected routes with layout */}
          <Route element={<AuthLayout />}>
            {/* Add more protected routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App

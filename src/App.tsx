
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import NavBar from "@/components/layout/NavBar";

// Page imports
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import InstructorDashboard from "@/pages/dashboard/InstructorDashboard";
import SupervisorDashboard from "@/pages/dashboard/SupervisorDashboard";
import ActivityList from "@/pages/activities/ActivityList";
import ActivityForm from "@/pages/activities/ActivityForm";
import ActivityDetails from "@/pages/activities/ActivityDetails";
import SubmissionForm from "@/pages/submissions/SubmissionForm";
import SubmissionList from "@/pages/submissions/SubmissionList";
import StudentList from "@/pages/students/StudentList";
import NotFound from "@/pages/NotFound";

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  React.useEffect(() => {
    document.documentElement.classList.add("antialiased");
  }, []);

  // Protect routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  // Role-based routes
  const RoleRoute = ({ 
    children, 
    allowedRoles 
  }: { 
    children: React.ReactNode, 
    allowedRoles: UserRole[] 
  }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (user && allowedRoles.includes(user.role)) {
      return <>{children}</>;
    }
    return <Navigate to="/dashboard" />;
  };

  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on role
      if (user) {
        switch (user.role) {
          case UserRole.Student:
            return <Navigate to="/dashboard" />;
          case UserRole.Instructor:
            return <Navigate to="/instructor/dashboard" />;
          case UserRole.Supervisor:
            return <Navigate to="/supervisor/dashboard" />;
        }
      }
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/dashboard"
              element={
                <RoleRoute allowedRoles={[UserRole.Instructor]}>
                  <InstructorDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/supervisor/dashboard"
              element={
                <RoleRoute allowedRoles={[UserRole.Supervisor]}>
                  <SupervisorDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <ActivityList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activities/create"
              element={
                <RoleRoute allowedRoles={[UserRole.Instructor]}>
                  <ActivityForm />
                </RoleRoute>
              }
            />
            <Route
              path="/activities/:activityId"
              element={
                <ProtectedRoute>
                  <ActivityDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submissions/new/:activityId"
              element={
                <RoleRoute allowedRoles={[UserRole.Student]}>
                  <SubmissionForm activityId="1" />
                </RoleRoute>
              }
            />
            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <SubmissionList />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/students" 
              element={
                <RoleRoute allowedRoles={[UserRole.Instructor, UserRole.Supervisor]}>
                  <StudentList />
                </RoleRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;

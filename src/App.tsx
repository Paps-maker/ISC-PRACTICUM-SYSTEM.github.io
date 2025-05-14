
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
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
      return <div>Loading...</div>; // Show a loading indicator
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>; // Show a loading indicator
    }
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on role
      if (user) {
        switch (user.role) {
          case "student":
            return <Navigate to="/dashboard/student" />;
          case "instructor":
            return <Navigate to="/dashboard/instructor" />;
          case "supervisor":
            return <Navigate to="/dashboard/supervisor" />;
        }
      }
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  };

  // Get dashboard component based on role
  const DashboardRedirect = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case "student":
        return <Navigate to="/dashboard/student" />;
      case "instructor":
        return <Navigate to="/dashboard/instructor" />;
      case "supervisor":
        return <Navigate to="/dashboard/supervisor" />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <NavBar />
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
          
          {/* Dashboard redirect based on role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          
          {/* Role-specific dashboards */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/supervisor"
            element={
              <ProtectedRoute>
                <SupervisorDashboard />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <ActivityForm />
              </ProtectedRoute>
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
          {/* Fix the submissions route - changed from nested param to query param */}
          <Route
            path="/submissions/new"
            element={
              <ProtectedRoute>
                <SubmissionForm activityId="" />
              </ProtectedRoute>
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
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;

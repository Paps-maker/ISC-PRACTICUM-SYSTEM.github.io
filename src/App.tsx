
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import InstructorDashboard from "./pages/dashboard/InstructorDashboard";
import SupervisorDashboard from "./pages/dashboard/SupervisorDashboard";
import ActivityList from "./pages/activities/ActivityList";
import ActivityDetails from "./pages/activities/ActivityDetails";
import SubmissionForm from "./pages/submissions/SubmissionForm";
import SubmissionList from "./pages/submissions/SubmissionList";
import NotFound from "./pages/NotFound";
import NavBar from "./components/layout/NavBar";
import Sidebar from "./components/layout/Sidebar";
import { UserRole } from "./types";

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, show nothing
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If specific roles are required, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === UserRole.Student) {
      return <Navigate to="/dashboard/student" />;
    } else if (user.role === UserRole.Instructor) {
      return <Navigate to="/dashboard/instructor" />;
    } else if (user.role === UserRole.Supervisor) {
      return <Navigate to="/dashboard/supervisor" />;
    }
    
    // Fallback if role doesn't match expected values
    return <Navigate to="/" />;
  }
  
  return element;
};

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1">
        <NavBar />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student routes */}
            <Route 
              path="/dashboard/student" 
              element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={[UserRole.Student]} />} 
            />
            
            {/* Instructor routes */}
            <Route 
              path="/dashboard/instructor" 
              element={<ProtectedRoute element={<InstructorDashboard />} allowedRoles={[UserRole.Instructor]} />} 
            />
            
            {/* Supervisor routes */}
            <Route 
              path="/dashboard/supervisor" 
              element={<ProtectedRoute element={<SupervisorDashboard />} allowedRoles={[UserRole.Supervisor]} />} 
            />
            
            {/* Activity routes */}
            <Route path="/activities" element={<ProtectedRoute element={<ActivityList />} />} />
            <Route path="/activities/:activityId" element={<ProtectedRoute element={<ActivityDetails />} />} />
            
            {/* Submission routes */}
            <Route path="/submissions" element={<ProtectedRoute element={<SubmissionList />} />} />
            <Route path="/submissions/new" element={<ProtectedRoute element={<SubmissionForm />} />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
